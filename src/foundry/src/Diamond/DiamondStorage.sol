// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "../../lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

library DiamondStorage {
    //constant types
    //////Loan automation
    uint256 constant MIN_LOAN_DURATION = 30 days; // Updated minimum duration
    uint256 constant MAX_LOAN_DURATION = 365 days;
    uint256 constant BASE_INTEREST_RATE = 500; // 5% in basis points
    uint256 constant LIQUIDATION_THRESHOLD = 8000; // 80% in basis points
    //////

    // --- SHARED CUSTOM ERRORS ---
    // Errors originally from AutomationLoan.sol, now shared:
    error InvalidLoanDuration();
    error InsufficientCollateral(); // Note: This name is used in AutomationLoan
    error LoanAlreadyExists();
    error LoanNotActive();
    error InsufficientRepayment();
    error InvalidUserAccount();
    error Unauthorized();
    error TransferFailed();
    error InsufficientBuffer();
    error PaymentNotDue();
    // Errors added for internal consistency in AutomationLoan.sol:
    error LoanIdMismatch();
    error LoanDataNotFoundForLoanId();

    // Cross-chain specific errors
    error CrossChainNotEnabled();
    error InvalidCrossChainSetup();
    error CrossChainPaymentFailed();

    struct UserAccount {
        // For AuthUser facet or general user account info
        bool isAuth;
        uint256 amount;
        uint256 duration;
        uint256 rate;
        address tokenAddress;
    }

    struct VaultState {
        // State variables
        uint256 _tokenIdCounter;
        address owner;
        mapping(address => mapping(uint256 => UserAccount)) User;
        // Track all NFT IDs owned by each user
        mapping(address => uint256[]) userNftIds;
        // NFT metadata tracking
        mapping(uint256 => string) tokenURIs;
        mapping(bytes4 => bool) supportedInterfaces;
        /////Loan automation state
        mapping(uint256 => LoanData) loans; // NFT ID => Loan Data
        mapping(uint256 => uint256) loanIdToCollateralTokenId; // Loan ID => Collateral Token ID
        mapping(address => uint256[]) userLoans; // User => Array of their loan IDs
        mapping(uint256 => uint256) accountToLoans; // Account TokenId => Loan ID
        mapping(address => uint256) totalTokenLocked; // token address => amount
        mapping(address => uint256) totalBufferLockedByToken; // token address => buffer amount
        uint256 totalActiveLoans;
        uint256 totalERC20Locked;
        uint256 currentLoanId;
        uint256 totalBufferLocked;
        // Cross-chain integration flags
        bool crossChainEnabled;
        address crossChainFacet; // Address of the cross-chain facet for internal calls
        // Cross-chain buffer balances (received from other chains)
        mapping(address => uint256) crossChainBufferBalance;
        // Track cross-chain EMI preferences per loan
        mapping(uint256 => bool) loanUseCrossChainEmi; // loanId => use cross-chain EMI
    }

    ///// Loan data Structure
    struct LoanData {
        uint256 loanId; // Unique loan identifier
        uint256 loanAmount; // Amount in USDC
        uint256 startTime;
        uint256 duration;
        uint256 interestRate;
        uint256 totalDebt;
        bool isActive;
        address borrower;
        uint256 userAccountTokenId; // User's account NFT token ID
        uint256 bufferAmount; // Total buffer collected
        uint256 remainingBuffer; // Current buffer balance
        uint256 lastPaymentTime; // Track last payment timestamp
        bool[] monthlyPayments; // Track monthly payments status
        address tokenAddress;
        // Cross-chain specific fields
        bool useCrossChainBuffer; // Whether this loan uses cross-chain buffer
        bool useCrossChainEmi; // Whether this loan uses cross-chain EMI
        uint64 emiChainSelector; // Chain where EMI payments come from
        address emiTokenAddress; // Token address on EMI chain
    }

    bytes32 constant DIAMOND_STORAGE_POSITION =
        keccak256("diamond.standard.vault.storage");

    function getStorage() internal pure returns (VaultState storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}
