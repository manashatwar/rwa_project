// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/security/ReentrancyGuard.sol";

import {LibDiamond} from "./libraries/LibDiamond.sol";
import {LibCrossChain} from "./CrossChainFacet.sol";
import {Modifiers} from "./Modifiers.sol";

// Loan storage library
library LibLoan {
    bytes32 constant LOAN_STORAGE_POSITION = keccak256("tangible.loan.storage");

    struct Loan {
        uint256 id;
        address borrower;
        address collateralToken;
        address borrowToken;
        uint256 collateralAmount;
        uint256 borrowAmount;
        uint256 emiAmount;
        uint256 tenure; // in months
        uint256 paidEmis;
        uint256 nextEmiDate;
        uint256 createdAt;
        bool isActive;
        // Cross-chain specific fields
        uint64 emiChain; // Chain selector for EMI payments
        address emiToken; // Token for EMI payments
        bool isCrossChainEmi;
    }

    struct LoanStorage {
        mapping(uint256 => Loan) loans;
        mapping(address => uint256[]) userLoans;
        uint256 loanCounter;
        // Buffer management
        mapping(address => uint256) userBufferBalance;
        mapping(address => address) userBufferToken;
        // Cross-chain buffer preferences
        mapping(address => uint64) userBufferChain;
        mapping(address => bool) isCrossChainBuffer;
        // EMI automation
        mapping(uint256 => bool) automatedEmis;
        uint256 gracePeriod; // in seconds
        // Collateral and loan parameters
        mapping(address => uint256) collateralRatios; // token => ratio (in basis points)
        mapping(address => bool) supportedCollaterals;
        mapping(address => bool) supportedBorrowTokens;
    }

    function loanStorage() internal pure returns (LoanStorage storage ls) {
        bytes32 position = LOAN_STORAGE_POSITION;
        assembly {
            ls.slot := position
        }
    }
}

contract AutomationLoan is Modifiers, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events
    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        address collateralToken,
        address borrowToken,
        uint256 collateralAmount,
        uint256 borrowAmount,
        uint256 emiAmount,
        uint256 tenure,
        bool isCrossChainEmi,
        uint64 emiChain
    );

    event BufferDeposited(
        address indexed user,
        address token,
        uint256 amount,
        bool isCrossChain,
        uint64 chain
    );

    event CrossChainBufferInitiated(
        address indexed user,
        uint64 destinationChain,
        address token,
        uint256 amount,
        bytes32 messageId
    );

    event EmiPaid(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 emiNumber,
        bool isCrossChain,
        bytes32 messageId
    );

    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    event BufferChainPreferenceSet(
        address indexed user,
        uint64 chainSelector,
        address token
    );

    // Custom errors
    error InvalidCollateral();
    error InsufficientCollateral();
    error LoanNotFound();
    error NotLoanBorrower();
    error LoanNotActive();
    error EmiNotDue();
    error InsufficientBuffer();
    error InvalidTenure();
    error InvalidEmiAmount();
    error UnsupportedToken();
    error CrossChainNotConfigured();

    // ========== INITIALIZATION ==========

    function initializeLoan() external onlyOwner {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        ls.gracePeriod = 7 days; // Default grace period
        ls.loanCounter = 1; // Start loan IDs from 1
    }

    // ========== ADMIN FUNCTIONS ==========

    function addSupportedCollateral(
        address _token,
        uint256 _ratio
    ) external onlyOwner {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        ls.supportedCollaterals[_token] = true;
        ls.collateralRatios[_token] = _ratio;
    }

    function addSupportedBorrowToken(address _token) external onlyOwner {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        ls.supportedBorrowTokens[_token] = true;
    }

    function setGracePeriod(uint256 _gracePeriod) external onlyOwner {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        ls.gracePeriod = _gracePeriod;
    }

    // ========== BUFFER MANAGEMENT ==========

    function setBufferChainPreference(
        uint64 _chainSelector,
        address _token
    ) external {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain
            .crossChainStorage();

        // Validate chain and token support
        if (!cs.allowlistedChains[_chainSelector])
            revert CrossChainNotConfigured();
        if (!cs.supportedTokens[_chainSelector][_token])
            revert UnsupportedToken();

        ls.userBufferChain[msg.sender] = _chainSelector;
        ls.userBufferToken[msg.sender] = _token;
        ls.isCrossChainBuffer[msg.sender] = true;

        emit BufferChainPreferenceSet(msg.sender, _chainSelector, _token);
    }

    function depositBuffer(
        address _token,
        uint256 _amount,
        bool _useCrossChain
    ) external nonReentrant returns (bytes32 messageId) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();

        if (_useCrossChain) {
            // Check if user has set cross-chain preferences
            uint64 bufferChain = ls.userBufferChain[msg.sender];
            if (bufferChain == 0) revert CrossChainNotConfigured();

            // Transfer tokens to this contract first
            IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

            // Initiate cross-chain buffer deposit
            // This will call CrossChainFacet internally
            messageId = _initiateCrossChainBuffer(msg.sender, _token, _amount);

            emit CrossChainBufferInitiated(
                msg.sender,
                bufferChain,
                _token,
                _amount,
                messageId
            );
        } else {
            // Local buffer deposit
            IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
            ls.userBufferBalance[msg.sender] += _amount;
            ls.userBufferToken[msg.sender] = _token;

            emit BufferDeposited(msg.sender, _token, _amount, false, 0);
        }

        return messageId;
    }

    // ========== LOAN CREATION ==========

    function createLoan(
        address _collateralToken,
        address _borrowToken,
        uint256 _collateralAmount,
        uint256 _borrowAmount,
        uint256 _tenure,
        bool _useCrossChainEmi,
        uint64 _emiChain,
        address _emiToken
    ) external nonReentrant returns (uint256 loanId) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();

        // Validations
        if (!ls.supportedCollaterals[_collateralToken])
            revert InvalidCollateral();
        if (!ls.supportedBorrowTokens[_borrowToken]) revert UnsupportedToken();
        if (_tenure == 0 || _tenure > 120) revert InvalidTenure(); // Max 10 years

        // Check collateral ratio
        uint256 requiredCollateral = (_borrowAmount *
            ls.collateralRatios[_collateralToken]) / 10000;
        if (_collateralAmount < requiredCollateral)
            revert InsufficientCollateral();

        // Cross-chain EMI validations
        if (_useCrossChainEmi) {
            LibCrossChain.CrossChainStorage storage cs = LibCrossChain
                .crossChainStorage();
            if (!cs.allowlistedChains[_emiChain])
                revert CrossChainNotConfigured();
            if (!cs.supportedTokens[_emiChain][_emiToken])
                revert UnsupportedToken();
        }

        // Calculate EMI amount
        uint256 emiAmount = _borrowAmount / _tenure;
        if (emiAmount == 0) revert InvalidEmiAmount();

        // Transfer collateral
        IERC20(_collateralToken).safeTransferFrom(
            msg.sender,
            address(this),
            _collateralAmount
        );

        // Transfer borrow amount to user
        IERC20(_borrowToken).safeTransfer(msg.sender, _borrowAmount);

        // Create loan
        loanId = ls.loanCounter++;
        ls.loans[loanId] = LibLoan.Loan({
            id: loanId,
            borrower: msg.sender,
            collateralToken: _collateralToken,
            borrowToken: _borrowToken,
            collateralAmount: _collateralAmount,
            borrowAmount: _borrowAmount,
            emiAmount: emiAmount,
            tenure: _tenure,
            paidEmis: 0,
            nextEmiDate: block.timestamp + 30 days, // First EMI after 30 days
            createdAt: block.timestamp,
            isActive: true,
            emiChain: _emiChain,
            emiToken: _emiToken,
            isCrossChainEmi: _useCrossChainEmi
        });

        ls.userLoans[msg.sender].push(loanId);

        // Set cross-chain EMI preferences if applicable
        if (_useCrossChainEmi) {
            LibCrossChain.CrossChainStorage storage cs = LibCrossChain
                .crossChainStorage();
            cs.loanEmiChain[loanId] = _emiChain;
            cs.loanEmiToken[loanId] = _emiToken;
        }

        emit LoanCreated(
            loanId,
            msg.sender,
            _collateralToken,
            _borrowToken,
            _collateralAmount,
            _borrowAmount,
            emiAmount,
            _tenure,
            _useCrossChainEmi,
            _emiChain
        );

        return loanId;
    }

    // ========== EMI PAYMENT ==========

    function payEmi(
        uint256 _loanId
    ) external nonReentrant returns (bytes32 messageId) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        LibLoan.Loan storage loan = ls.loans[_loanId];

        // Validations
        if (loan.id == 0) revert LoanNotFound();
        if (loan.borrower != msg.sender) revert NotLoanBorrower();
        if (!loan.isActive) revert LoanNotActive();
        if (block.timestamp < loan.nextEmiDate) revert EmiNotDue();

        if (loan.isCrossChainEmi) {
            // Cross-chain EMI payment
            messageId = _initiateCrossChainEmi(_loanId, loan.emiAmount);

            emit EmiPaid(
                _loanId,
                msg.sender,
                loan.emiAmount,
                loan.paidEmis + 1,
                true,
                messageId
            );
        } else {
            // Local EMI payment
            IERC20(loan.borrowToken).safeTransferFrom(
                msg.sender,
                address(this),
                loan.emiAmount
            );

            emit EmiPaid(
                _loanId,
                msg.sender,
                loan.emiAmount,
                loan.paidEmis + 1,
                false,
                bytes32(0)
            );
        }

        // Update loan state
        loan.paidEmis++;
        loan.nextEmiDate += 30 days; // Next EMI after 30 days

        // Check if loan is fully paid
        if (loan.paidEmis >= loan.tenure) {
            loan.isActive = false;
            // Return collateral
            IERC20(loan.collateralToken).safeTransfer(
                loan.borrower,
                loan.collateralAmount
            );
        }

        return messageId;
    }

    // ========== AUTOMATION FUNCTIONS ==========

    function enableEmiAutomation(uint256 _loanId) external {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        LibLoan.Loan storage loan = ls.loans[_loanId];

        if (loan.borrower != msg.sender) revert NotLoanBorrower();
        if (!loan.isActive) revert LoanNotActive();

        ls.automatedEmis[_loanId] = true;
    }

    function disableEmiAutomation(uint256 _loanId) external {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        LibLoan.Loan storage loan = ls.loans[_loanId];

        if (loan.borrower != msg.sender) revert NotLoanBorrower();

        ls.automatedEmis[_loanId] = false;
    }

    // Function to be called by Chainlink Automation
    function executeAutomatedEmi(
        uint256 _loanId
    ) external returns (bytes32 messageId) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        LibLoan.Loan storage loan = ls.loans[_loanId];

        // Check if automation is enabled and EMI is due
        if (!ls.automatedEmis[_loanId]) return bytes32(0);
        if (!loan.isActive) return bytes32(0);
        if (block.timestamp < loan.nextEmiDate) return bytes32(0);

        // Check if grace period has passed
        if (block.timestamp > loan.nextEmiDate + ls.gracePeriod) {
            // Mark loan as defaulted
            loan.isActive = false;
            emit LoanDefaulted(_loanId, loan.borrower);
            return bytes32(0);
        }

        if (loan.isCrossChainEmi) {
            // Try cross-chain EMI payment
            try this._initiateCrossChainEmi(_loanId, loan.emiAmount) returns (
                bytes32 msgId
            ) {
                messageId = msgId;
            } catch {
                // Handle failure - could implement retry logic
                return bytes32(0);
            }
        } else {
            // Local EMI payment from buffer
            if (ls.userBufferBalance[loan.borrower] >= loan.emiAmount) {
                ls.userBufferBalance[loan.borrower] -= loan.emiAmount;
            } else {
                // Insufficient buffer - mark as defaulted if grace period passed
                if (block.timestamp > loan.nextEmiDate + ls.gracePeriod) {
                    loan.isActive = false;
                    emit LoanDefaulted(_loanId, loan.borrower);
                }
                return bytes32(0);
            }
        }

        // Update loan state
        loan.paidEmis++;
        loan.nextEmiDate += 30 days;

        if (loan.paidEmis >= loan.tenure) {
            loan.isActive = false;
            IERC20(loan.collateralToken).safeTransfer(
                loan.borrower,
                loan.collateralAmount
            );
        }

        emit EmiPaid(
            _loanId,
            loan.borrower,
            loan.emiAmount,
            loan.paidEmis,
            loan.isCrossChainEmi,
            messageId
        );

        return messageId;
    }

    // ========== INTERNAL FUNCTIONS ==========

    function _initiateCrossChainBuffer(
        address _user,
        address _token,
        uint256 _amount
    ) internal returns (bytes32 messageId) {
        // This would call CrossChainFacet's payBufferCrossChain function
        // For now, returning a mock message ID
        return
            keccak256(
                abi.encodePacked(_user, _token, _amount, block.timestamp)
            );
    }

    function _initiateCrossChainEmi(
        uint256 _loanId,
        uint256 _amount
    ) external returns (bytes32 messageId) {
        require(msg.sender == address(this), "Internal only");
        // This would call CrossChainFacet's payEmiCrossChain function
        // For now, returning a mock message ID
        return keccak256(abi.encodePacked(_loanId, _amount, block.timestamp));
    }

    // ========== VIEW FUNCTIONS ==========

    function getLoan(
        uint256 _loanId
    ) external view returns (LibLoan.Loan memory) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        return ls.loans[_loanId];
    }

    function getUserLoans(
        address _user
    ) external view returns (uint256[] memory) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        return ls.userLoans[_user];
    }

    function getUserBufferBalance(
        address _user
    ) external view returns (uint256, address) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        return (ls.userBufferBalance[_user], ls.userBufferToken[_user]);
    }

    function getUserBufferChainPreference(
        address _user
    ) external view returns (uint64, address, bool) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        return (
            ls.userBufferChain[_user],
            ls.userBufferToken[_user],
            ls.isCrossChainBuffer[_user]
        );
    }

    function isEmiAutomationEnabled(
        uint256 _loanId
    ) external view returns (bool) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        return ls.automatedEmis[_loanId];
    }

    function getNextEmiDueDate(
        uint256 _loanId
    ) external view returns (uint256) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        return ls.loans[_loanId].nextEmiDate;
    }

    function isLoanDefaulted(uint256 _loanId) external view returns (bool) {
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();
        LibLoan.Loan storage loan = ls.loans[_loanId];

        if (!loan.isActive) return false;

        return block.timestamp > loan.nextEmiDate + ls.gracePeriod;
    }
}
