//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {DiamondStorage} from "./DiamondStorage.sol";
import {viewFacet} from "./ViewFacet.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

contract AutomationLoan is AutomationCompatibleInterface {
    // Events stay in this contract as they're specific to automation
    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 indexed tokenId,
        uint256 accountTokenId,
        uint256 amount,
        address tokenAddress
    );
    event BufferDeducted(uint256 indexed loanId, uint256 amount);
    event BufferReturned(uint256 indexed loanId, uint256 amount);
    event LoanRepaid(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount
    );
    event LoanLiquidated(uint256 indexed loanId, address indexed borrower);

    viewFacet private vf;
    IERC721 public immutable nftContract;
    IERC721 public immutable userAccountNFT;

    constructor(
        address _nftContract,
        address _userAccountNFT,
        address _viewFacet
    ) {
        nftContract = IERC721(_nftContract);
        userAccountNFT = IERC721(_userAccountNFT);
        vf = viewFacet(_viewFacet);
    }

    function createLoan(
        uint256 tokenId,
        uint256 accountTokenId,
        uint256 duration,
        uint256 amount,
        address tokenAddress
    ) external {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        address borrower = msg.sender;
        // CHECKS - Use viewFacet's validation
        vf.validateLoanCreationView(tokenId, duration);

        // Validate token address
        if (tokenAddress == address(0)) {
            revert DiamondStorage.InvalidUserAccount();
        }

        // Update the token address in the user account
        ds.User[borrower][accountTokenId].tokenAddress = tokenAddress;

        IERC20 token = IERC20(tokenAddress);

        // Calculate interest and buffer - in ViewFacet
        (uint256 totalDebt, uint256 bufferAmount) = vf.calculateLoanTerms(
            amount,
            duration
        );

        // Check ownership and allowance
        if (nftContract.ownerOf(tokenId) != borrower) {
            revert DiamondStorage.Unauthorized();
        }
        if (
            token.allowance(borrower, address(this)) <
            (amount + bufferAmount + bufferAmount)
        ) {
            revert DiamondStorage.InsufficientCollateral();
        }

        // EFFECTS - moved loan creation to internal function to reduce stack variables
        uint256 loanId = _createLoanId(
            tokenId,
            accountTokenId,
            duration,
            amount,
            totalDebt,
            bufferAmount,
            tokenAddress,
            ds
        );

        // INTERACTIONS - simplified transfer logic to reduce stack variables
        _handleTransfers(
            tokenId,
            amount,
            bufferAmount,
            loanId,
            accountTokenId,
            tokenAddress,
            ds
        );

        // Update token-specific tracking
        ds.totalTokenLocked[tokenAddress] += amount;
        ds.totalBufferLockedByToken[tokenAddress] += bufferAmount;

        // Update the legacy fields too for backward compatibility
        ds.totalERC20Locked += amount;
        ds.totalBufferLocked += bufferAmount;

        emit LoanCreated(
            loanId,
            borrower,
            tokenId,
            accountTokenId,
            amount,
            tokenAddress
        );
    }

    // Internal function to create loan storage - reduces stack depth in main function
    function _createLoanId(
        uint256 tokenId,
        uint256 accountTokenId,
        uint256 duration,
        uint256 amount,
        uint256 totalDebt,
        uint256 bufferAmount,
        address tokenAddress,
        DiamondStorage.VaultState storage ds
    ) internal returns (uint256 loanId) {
        // Initialize monthly payments array
        bool[] memory monthlyPayments = new bool[](duration / 30 days);
        address borrower = msg.sender;
        // Generate loan ID and calculate terms
        loanId = ++ds.currentLoanId;
        uint256 interestRate = vf.calculateInterestRate(duration);

        // Update storage state
        ds.loans[tokenId] = DiamondStorage.LoanData({
            loanId: loanId,
            loanAmount: amount,
            startTime: block.timestamp,
            duration: duration,
            interestRate: interestRate,
            totalDebt: totalDebt,
            isActive: true,
            borrower: borrower,
            userAccountTokenId: accountTokenId,
            bufferAmount: bufferAmount,
            remainingBuffer: bufferAmount,
            lastPaymentTime: block.timestamp,
            monthlyPayments: monthlyPayments,
            tokenAddress: tokenAddress // Add token address
        });

        // Link the generatedLoanId to the primary key (tokenId)
        ds.loanIdToCollateralTokenId[loanId] = tokenId;
        ds.userLoans[borrower].push(loanId);
        ds.accountToLoans[accountTokenId] = loanId;
        ds.totalActiveLoans++;
    }

    function _handleTransfers(
        uint256 tokenId,
        uint256 amount,
        uint256 bufferAmount,
        uint256 loanId,
        uint256 accountTokenId,
        address tokenAddress,
        DiamondStorage.VaultState storage ds
    ) internal {
        bool success = false;
        IERC20 token = IERC20(tokenAddress);
        address borrower = msg.sender;
        try nftContract.transferFrom(borrower, address(this), tokenId) {
            // Transfer NFT to contract
            try token.transferFrom(borrower, address(this), bufferAmount) {
                // Transfer buffer amount from user to contract

                // Disburse loan amount to user
                try token.transfer(borrower, amount) {
                    success = true;
                } catch {
                    // If loan disbursement fails, return buffer and NFT
                    token.transfer(borrower, bufferAmount);
                    nftContract.transferFrom(
                        address(this),
                        borrower,
                        tokenId
                    );
                }
            } catch {
                // If buffer transfer fails, return NFT
                nftContract.transferFrom(address(this),borrower, tokenId);
            }
        } catch {
            // NFT transfer failed
        }

        if (!success) {
            // Revert all state changes
            _revertLoanCreationWithAccount(
                tokenId,
                loanId,
                accountTokenId,
                amount,
                bufferAmount,
                tokenAddress,
                ds
            );
            revert DiamondStorage.TransferFailed();
        }
    }

    // Internal function to revert loan creation - reduces stack depth in main function
    function _revertLoanCreationWithAccount(
        uint256 tokenId,
        uint256 loanId,
        uint256 accountTokenId,
        uint256 amount,
        uint256 bufferAmount,
        address tokenAddress,
        DiamondStorage.VaultState storage ds
    ) internal {
        delete ds.loans[tokenId];
        delete ds.loanIdToCollateralTokenId[loanId];
         address borrower = msg.sender;
        // Clean user loans array - simplified to reduce stack variables
        uint256[] storage userLoanIds = ds.userLoans[borrower];
        for (uint j = userLoanIds.length; j > 0; j--) {
            //delete the loan ID from that user's loan array
            if (userLoanIds[j - 1] == loanId) {
                userLoanIds[j - 1] = userLoanIds[userLoanIds.length - 1];
                userLoanIds.pop();
                break;
            }
        }

        if (ds.accountToLoans[accountTokenId] == loanId) {
            delete ds.accountToLoans[accountTokenId];
        }
        if (ds.totalActiveLoans > 0) ds.totalActiveLoans--;
        ds.totalERC20Locked -= amount; // Changed from totalUSDCLocked to be consistent
        ds.totalBufferLocked -= bufferAmount;

        // Add token-specific tracking updates
        if (tokenAddress != address(0)) {
            ds.totalTokenLocked[tokenAddress] -= amount;
            ds.totalBufferLockedByToken[tokenAddress] -= bufferAmount;
        }
    }

    // Internal function to revert loan creation - reduces stack depth in main function
    function _revertLoanCreation(
        uint256 tokenId,
        uint256 loanId,
        uint256 amount,
        uint256 bufferAmount,
        DiamondStorage.VaultState storage ds
    ) internal {
        // Get accountTokenId before deleting loan data - fixed stack depth issue
        uint256 accountTokenId = ds.loans[tokenId].userAccountTokenId;
        address tokenAddress = ds.loans[tokenId].tokenAddress; // Add this line to get the token address
        address borrower = msg.sender;
        delete ds.loans[tokenId];
        delete ds.loanIdToCollateralTokenId[loanId];

        // Clean user loans array - simplified to reduce stack variables
        uint256[] storage userLoanIds = ds.userLoans[borrower];
        for (uint j = userLoanIds.length; j > 0; j--) {
            //delete the loan ID from that user's loan array
            if (userLoanIds[j - 1] == loanId) {
                userLoanIds[j - 1] = userLoanIds[userLoanIds.length - 1];
                userLoanIds.pop();
                break;
            }
        }

        if (ds.accountToLoans[accountTokenId] == loanId) {
            delete ds.accountToLoans[accountTokenId];
        }
        if (ds.totalActiveLoans > 0) ds.totalActiveLoans--;
        ds.totalERC20Locked -= amount; // Standardize on totalERC20Locked
        ds.totalBufferLocked -= bufferAmount;

        // Add token-specific tracking updates
        if (tokenAddress != address(0)) {
            ds.totalTokenLocked[tokenAddress] -= amount;
            ds.totalBufferLockedByToken[tokenAddress] -= bufferAmount;
        }
    }

    // Automation functions
    function makeMonthlyPayment(uint256 loanId) external {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[loanId];
        if (collateralTokenId == 0) {
            revert DiamondStorage.LoanDataNotFoundForLoanId();
        }
        DiamondStorage.LoanData storage loan = ds.loans[collateralTokenId];

        if (!loan.isActive) {
            revert DiamondStorage.LoanNotActive();
        }
        if (loan.borrower != msg.sender) {
            revert DiamondStorage.Unauthorized(); //for get proper error from DiamondStorage
        }

        uint256 monthIndex = (block.timestamp - loan.startTime) / 30 days;
        if (monthIndex >= loan.monthlyPayments.length) {
            revert DiamondStorage.LoanNotActive();
        }
        if (loan.monthlyPayments[monthIndex]) {
            revert DiamondStorage.PaymentNotDue();
        }

        uint256 monthlyAmount = loan.totalDebt / loan.monthlyPayments.length;

        // Get the token for this specific loan
        IERC20 token = IERC20(loan.tokenAddress);

        // Transfer monthly payment
        token.transferFrom(msg.sender, address(this), monthlyAmount);

        loan.monthlyPayments[monthIndex] = true;
        loan.lastPaymentTime = block.timestamp;
    }

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 maxLoansToProcess = 50;
        (uint256[] memory overdueLoanIds_perform, uint256 count) = vf
            .getOverdueLoanIds(maxLoansToProcess);

        upkeepNeeded = count > 0;
        if (upkeepNeeded) {
            uint256[] memory finalOverdueLoanIds = new uint256[](count);
            for (uint j = 0; j < count; j++) {
                finalOverdueLoanIds[j] = overdueLoanIds_perform[j];
            }
            performData = abi.encode(finalOverdueLoanIds);
        } else {
            performData = bytes("");
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        uint256[] memory overdueLoanIds_param = abi.decode( // These are generated loanIds
            performData,
            (uint256[])
        );
        for (uint256 i = 0; i < overdueLoanIds_param.length; i++) {
            if (gasleft() < 60000) {
                break;
            }
            liquidateLoan(overdueLoanIds_param[i]); // Pass the generated loanId
        }
    }

    function liquidateLoan(uint256 loanId) internal {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[loanId];
        if (collateralTokenId == 0) {
            // This might happen if the loan was already liquidated/repaid and mapping cleared
            return;
        }
        DiamondStorage.LoanData storage loan = ds.loans[collateralTokenId]; // Access by collateralTokenId

        if (!loan.isActive || loan.loanId != loanId) return;

        uint256 monthIndex = (block.timestamp - loan.startTime) / 30 days;
        if (monthIndex >= loan.monthlyPayments.length) {
            return;
        }
        uint256 monthlyAmount = loan.totalDebt / (loan.duration / 30 days);

        if (loan.remainingBuffer >= monthlyAmount) {
            // Deduct from buffer
            loan.remainingBuffer -= monthlyAmount;
            loan.monthlyPayments[monthIndex] = true;
            loan.lastPaymentTime = block.timestamp;
            ds.totalBufferLocked -= monthlyAmount;

            // Add token-specific tracking update
            ds.totalBufferLockedByToken[loan.tokenAddress] -= monthlyAmount;

            emit BufferDeducted(loanId, monthlyAmount);
        } else {
            // Complete liquidation
            loan.isActive = false;
            delete ds.loanIdToCollateralTokenId[loanId]; // Clean up the link
            if (ds.totalActiveLoans > 0) ds.totalActiveLoans--;
            ds.totalERC20Locked -= loan.loanAmount; // Changed from totalUSDCLocked
            ds.totalBufferLocked -= loan.remainingBuffer;

            // Add token-specific tracking updates
            ds.totalTokenLocked[loan.tokenAddress] -= loan.loanAmount;
            ds.totalBufferLockedByToken[loan.tokenAddress] -= loan
                .remainingBuffer;

            emit LoanLiquidated(loanId, loan.borrower);
        }
    }

    function repayLoanFull(uint256 loanId) external {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[loanId];
        if (collateralTokenId == 0) {
            revert DiamondStorage.LoanDataNotFoundForLoanId();
        }
        DiamondStorage.LoanData storage loan = ds.loans[collateralTokenId]; // Access by collateralTokenId

        // Get the token for this specific loan
        IERC20 token = IERC20(loan.tokenAddress);

        if (!loan.isActive || loan.loanId != loanId) {
            // Integrity check
            revert DiamondStorage.LoanNotActive();
        }
        if (loan.borrower != msg.sender) {
            revert DiamondStorage.Unauthorized();
        }

        uint256 paidAmountSoFar = 0;
        uint256 monthlyInstallment = loan.totalDebt /
            loan.monthlyPayments.length;
        uint256 paidInstallmentsCount = 0;

        for (uint i = 0; i < loan.monthlyPayments.length; ++i) {
            if (loan.monthlyPayments[i]) {
                paidInstallmentsCount++;
            }
        }
        paidAmountSoFar = paidInstallmentsCount * monthlyInstallment;

        uint256 remainingDebtToPay = loan.totalDebt > paidAmountSoFar
            ? loan.totalDebt - paidAmountSoFar
            : 0;

        if (remainingDebtToPay > 0) {
            if (
                token.allowance(msg.sender, address(this)) < remainingDebtToPay
            ) {
                revert DiamondStorage.InsufficientCollateral();
            }
            token.transferFrom(msg.sender, address(this), remainingDebtToPay);
        }

        // Return remaining buffer
        if (loan.remainingBuffer > 0) {
            token.transfer(msg.sender, loan.remainingBuffer);
            emit BufferReturned(loanId, loan.remainingBuffer);
        }

        // Update state
        loan.isActive = false;
        if (ds.totalActiveLoans > 0) ds.totalActiveLoans--;
        ds.totalERC20Locked -= loan.loanAmount;
        ds.totalBufferLocked -= loan.remainingBuffer;

        ds.totalTokenLocked[loan.tokenAddress] -= loan.loanAmount;
        ds.totalBufferLockedByToken[loan.tokenAddress] -= loan.remainingBuffer;

        // Return NFT
        nftContract.transferFrom(
            address(this),
            msg.sender,
            loan.userAccountTokenId
        );

        emit LoanRepaid(loanId, msg.sender, remainingDebtToPay);
    }
}
