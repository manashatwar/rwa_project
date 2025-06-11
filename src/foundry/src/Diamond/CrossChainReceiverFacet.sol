// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IAny2EVMMessageReceiver} from "@chainlink/contracts-ccip/contracts/interfaces/IAny2EVMMessageReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

import {LibDiamond} from "./libraries/LibDiamond.sol";
import {LibCrossChain} from "./CrossChainFacet.sol";
import {LibLoan} from "./AutomationLoan.sol";
import {Modifiers} from "./Modifiers.sol";

// Additional storage for receiver functionality
library LibCrossChainReceiver {
    bytes32 constant CROSS_CHAIN_RECEIVER_STORAGE_POSITION =
        keccak256("tangible.crosschain.receiver.storage");

    struct CrossChainReceiverStorage {
        // Mapping to track authorized senders per chain
        mapping(uint64 => mapping(address => bool)) authorizedSenders;
        // Router address for validating incoming messages
        address router;
        // Message processing status
        mapping(bytes32 => bool) processedMessages;
        // Failed messages for retry
        mapping(bytes32 => Client.Any2EVMMessage) failedMessages;
        mapping(bytes32 => string) failureReasons;
        // Buffer management
        mapping(address => uint256) userBufferBalance;
        // Cross-chain operation tracking
        mapping(bytes32 => bool) crossChainOperationCompleted;
    }

    function crossChainReceiverStorage()
        internal
        pure
        returns (CrossChainReceiverStorage storage crs)
    {
        bytes32 position = CROSS_CHAIN_RECEIVER_STORAGE_POSITION;
        assembly {
            crs.slot := position
        }
    }
}

contract CrossChainReceiverFacet is IAny2EVMMessageReceiver, Modifiers {
    using SafeERC20 for IERC20;

    // Events
    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChain,
        address indexed sender,
        string messageType,
        bool success
    );
    event BufferPaymentProcessed(
        bytes32 indexed messageId,
        address indexed user,
        address token,
        uint256 amount
    );
    event EmiPaymentProcessed(
        bytes32 indexed messageId,
        address indexed user,
        uint256 indexed loanId,
        address token,
        uint256 amount
    );
    event AuthorizedSenderAdded(uint64 chainSelector, address sender);
    event AuthorizedSenderRemoved(uint64 chainSelector, address sender);
    event MessageRetryFailed(bytes32 indexed messageId, string reason);
    event MessageRetrySuccessful(bytes32 indexed messageId);
    event BufferBalanceUpdated(address indexed user, uint256 newBalance);

    // Custom errors
    error InvalidRouter(address router);
    error UnauthorizedSender(uint64 sourceChain, address sender);
    error MessageAlreadyProcessed(bytes32 messageId);
    error InvalidMessageData();
    error TokenTransferFailed();
    error MessageProcessingFailed(string reason);
    error InsufficientBufferBalance(
        address user,
        uint256 required,
        uint256 available
    );
    error InvalidLoanId(uint256 loanId);

    // Modifiers
    modifier onlyRouter() {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        if (msg.sender != crs.router) revert InvalidRouter(msg.sender);
        _;
    }

    modifier onlyAuthorizedSender(uint64 _sourceChain, address _sender) {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        if (!crs.authorizedSenders[_sourceChain][_sender])
            revert UnauthorizedSender(_sourceChain, _sender);
        _;
    }

    // ========== INITIALIZATION ==========

    function initializeCrossChainReceiver(address _router) external onlyOwner {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        crs.router = _router;
    }

    // ========== ADMIN FUNCTIONS ==========

    function addAuthorizedSender(
        uint64 _sourceChain,
        address _sender
    ) external onlyOwner {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        crs.authorizedSenders[_sourceChain][_sender] = true;
        emit AuthorizedSenderAdded(_sourceChain, _sender);
    }

    function removeAuthorizedSender(
        uint64 _sourceChain,
        address _sender
    ) external onlyOwner {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        crs.authorizedSenders[_sourceChain][_sender] = false;
        emit AuthorizedSenderRemoved(_sourceChain, _sender);
    }

    // ========== CCIP MESSAGE RECEIVER ==========

    function ccipReceive(
        Client.Any2EVMMessage calldata message
    ) external override onlyRouter {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();

        // Check if message already processed
        if (crs.processedMessages[message.messageId])
            revert MessageAlreadyProcessed(message.messageId);

        // Extract sender address
        address sender = abi.decode(message.sender, (address));

        // Verify authorized sender
        if (!crs.authorizedSenders[message.sourceChainSelector][sender])
            revert UnauthorizedSender(message.sourceChainSelector, sender);

        // Mark as processed
        crs.processedMessages[message.messageId] = true;

        // Process the message
        bool success = _processMessage(message);

        if (!success) {
            // Store failed message for retry
            crs.failedMessages[message.messageId] = message;
        }

        emit MessageReceived(
            message.messageId,
            message.sourceChainSelector,
            sender,
            _getMessageType(message.data),
            success
        );
    }

    // ========== INTERNAL MESSAGE PROCESSING ==========

    function _processMessage(
        Client.Any2EVMMessage memory message
    ) internal returns (bool success) {
        try this._processMessageInternal(message) {
            return true;
        } catch Error(string memory reason) {
            LibCrossChainReceiver.CrossChainReceiverStorage
                storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
            crs.failureReasons[message.messageId] = reason;
            return false;
        } catch {
            LibCrossChainReceiver.CrossChainReceiverStorage
                storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
            crs.failureReasons[message.messageId] = "Unknown error";
            return false;
        }
    }

    function _processMessageInternal(
        Client.Any2EVMMessage memory message
    ) external {
        // This function should only be called internally
        require(msg.sender == address(this), "Internal only");

        if (message.data.length == 0) revert InvalidMessageData();

        // Decode message data
        (string memory messageType, bytes memory messageData) = abi.decode(
            message.data,
            (string, bytes)
        );

        if (
            keccak256(abi.encodePacked(messageType)) ==
            keccak256(abi.encodePacked("BUFFER_PAYMENT"))
        ) {
            _processBufferPayment(message, messageData);
        } else if (
            keccak256(abi.encodePacked(messageType)) ==
            keccak256(abi.encodePacked("EMI_PAYMENT"))
        ) {
            _processEmiPayment(message, messageData);
        } else {
            revert InvalidMessageData();
        }
    }

    function _processBufferPayment(
        Client.Any2EVMMessage memory message,
        bytes memory messageData
    ) internal {
        // Decode buffer payment data
        (address user, uint256 amount) = abi.decode(
            messageData,
            (address, uint256)
        );

        // Validate token transfer
        if (message.destTokenAmounts.length != 1) revert InvalidMessageData();

        Client.EVMTokenAmount memory tokenAmount = message.destTokenAmounts[0];
        if (tokenAmount.amount != amount) revert InvalidMessageData();

        // Update user's buffer balance
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        crs.userBufferBalance[user] += amount;

        // Store tokens in contract for buffer management
        // In a real implementation, you might want to convert to a standard buffer token

        emit BufferPaymentProcessed(
            message.messageId,
            user,
            tokenAmount.token,
            amount
        );

        emit BufferBalanceUpdated(user, crs.userBufferBalance[user]);
    }

    function _processEmiPayment(
        Client.Any2EVMMessage memory message,
        bytes memory messageData
    ) internal {
        // Decode EMI payment data
        (address user, uint256 loanId, uint256 amount) = abi.decode(
            messageData,
            (address, uint256, uint256)
        );

        // Validate token transfer
        if (message.destTokenAmounts.length != 1) revert InvalidMessageData();

        Client.EVMTokenAmount memory tokenAmount = message.destTokenAmounts[0];
        if (tokenAmount.amount != amount) revert InvalidMessageData();

        // Get loan storage to process EMI
        LibLoan.LoanStorage storage ls = LibLoan.loanStorage();

        // Validate loan exists
        if (ls.loanIdCounter < loanId || loanId == 0)
            revert InvalidLoanId(loanId);

        // Process EMI payment - update loan state
        LibLoan.Loan storage loan = ls.loans[loanId];

        // Validate loan belongs to user
        require(loan.borrower == user, "Unauthorized loan access");

        // Update EMI payment
        loan.paidEMIs += 1;
        loan.nextEMIDate = loan.nextEMIDate + loan.emiFrequency;

        // Check if loan is fully paid
        if (loan.paidEMIs >= loan.totalEMIs) {
            loan.status = LibLoan.LoanStatus.Completed;
        }

        // Store payment token for accounting
        IERC20(tokenAmount.token).safeTransfer(address(this), amount);

        emit EmiPaymentProcessed(
            message.messageId,
            user,
            loanId,
            tokenAmount.token,
            amount
        );
    }

    function _getMessageType(
        bytes memory data
    ) internal pure returns (string memory) {
        if (data.length == 0) return "UNKNOWN";

        try this._decodeMessageType(data) returns (string memory messageType) {
            return messageType;
        } catch {
            return "INVALID";
        }
    }

    function _decodeMessageType(
        bytes memory data
    ) external pure returns (string memory) {
        (string memory messageType, ) = abi.decode(data, (string, bytes));
        return messageType;
    }

    // ========== MESSAGE RETRY FUNCTIONALITY ==========

    function retryFailedMessage(bytes32 _messageId) external onlyOwner {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();

        Client.Any2EVMMessage memory message = crs.failedMessages[_messageId];
        if (message.messageId == bytes32(0)) revert InvalidMessageData();

        // Retry processing
        bool success = _processMessage(message);

        if (success) {
            // Clean up failed message storage
            delete crs.failedMessages[_messageId];
            delete crs.failureReasons[_messageId];
            emit MessageRetrySuccessful(_messageId);
        } else {
            emit MessageRetryFailed(_messageId, crs.failureReasons[_messageId]);
        }
    }

    // ========== VIEW FUNCTIONS ==========

    function getBufferBalance(address _user) external view returns (uint256) {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        return crs.userBufferBalance[_user];
    }

    function isAuthorizedSender(
        uint64 _sourceChain,
        address _sender
    ) external view returns (bool) {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        return crs.authorizedSenders[_sourceChain][_sender];
    }

    function isMessageProcessed(
        bytes32 _messageId
    ) external view returns (bool) {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        return crs.processedMessages[_messageId];
    }

    function getFailedMessage(
        bytes32 _messageId
    )
        external
        view
        returns (Client.Any2EVMMessage memory message, string memory reason)
    {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        message = crs.failedMessages[_messageId];
        reason = crs.failureReasons[_messageId];
    }

    function getRouterAddress() external view returns (address) {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();
        return crs.router;
    }

    // ========== BUFFER MANAGEMENT ==========

    function useBufferForEMI(
        address _user,
        uint256 _amount
    ) external onlyAuthorizedCaller returns (bool) {
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();

        if (crs.userBufferBalance[_user] < _amount) {
            revert InsufficientBufferBalance(
                _user,
                _amount,
                crs.userBufferBalance[_user]
            );
        }

        crs.userBufferBalance[_user] -= _amount;
        emit BufferBalanceUpdated(_user, crs.userBufferBalance[_user]);

        return true;
    }

    // ========== EMERGENCY FUNCTIONS ==========

    function emergencyWithdraw(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyOwner {
        IERC20(_token).safeTransfer(_to, _amount);
    }

    function emergencyWithdrawNative(
        address payable _to,
        uint256 _amount
    ) external onlyOwner {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed");
    }

    // Fallback to receive ETH
    receive() external payable {}
}
