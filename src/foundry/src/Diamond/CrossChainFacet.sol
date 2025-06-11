// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/security/ReentrancyGuard.sol";

import {LibDiamond} from "./libraries/LibDiamond.sol";
import {Modifiers} from "./Modifiers.sol";

// Storage for CrossChain functionality
library LibCrossChain {
    bytes32 constant CROSS_CHAIN_STORAGE_POSITION = keccak256("tangible.crosschain.storage");
    
    struct CrossChainStorage {
        // CCIP Router
        IRouterClient router;
        IERC20 linkToken;
        
        // Supported chains for cross-chain operations
        mapping(uint64 => bool) allowlistedChains;
        mapping(uint64 => address) chainReceivers; // Diamond contract address on each chain
        
        // User preferences for buffer payments
        mapping(address => uint64) userBufferChain;
        mapping(address => address) userBufferToken;
        
        // User preferences for EMI payments
        mapping(address => uint64) userEmiChain;
        mapping(address => address) userEmiToken;
        
        // Cross-chain message tracking
        mapping(bytes32 => bool) processedMessages;
        mapping(bytes32 => uint256) messageFees;
        
        // Supported tokens per chain
        mapping(uint64 => mapping(address => bool)) supportedTokens;
        
        // Loan to chain mapping for EMI payments
        mapping(uint256 => uint64) loanEmiChain;
        mapping(uint256 => address) loanEmiToken;
    }
    
    function crossChainStorage() internal pure returns (CrossChainStorage storage cs) {
        bytes32 position = CROSS_CHAIN_STORAGE_POSITION;
        assembly {
            cs.slot := position
        }
    }
}

contract CrossChainFacet is Modifiers, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Events
    event BufferChainSet(address indexed user, uint64 chainSelector, address token);
    event EmiChainSet(address indexed user, uint64 chainSelector, address token);
    event CrossChainBufferInitiated(
        bytes32 indexed messageId,
        address indexed user,
        uint64 destinationChain,
        address token,
        uint256 amount,
        uint256 fees
    );
    event CrossChainEmiInitiated(
        bytes32 indexed messageId,
        address indexed user,
        uint256 indexed loanId,
        uint64 destinationChain,
        address token,
        uint256 amount,
        uint256 fees
    );
    event ChainAllowlisted(uint64 chainSelector, bool allowed);
    event ChainReceiverSet(uint64 chainSelector, address receiver);
    event TokenSupportAdded(uint64 chainSelector, address token);
    event CrossChainMessageProcessed(bytes32 indexed messageId, bool success);
    
    // Custom errors
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error DestinationChainNotAllowed(uint64 destinationChainSelector);
    error InvalidReceiverAddress();
    error TokenNotSupported(uint64 chainSelector, address token);
    error MessageAlreadyProcessed(bytes32 messageId);
    error InvalidChainSelector();
    error BufferChainNotSet(address user);
    error EmiChainNotSet(address user);
    error InvalidLoanId(uint256 loanId);
    
    // Modifiers
    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        if (!cs.allowlistedChains[_destinationChainSelector])
            revert DestinationChainNotAllowed(_destinationChainSelector);
        _;
    }
    
    modifier validateReceiver(address _receiver) {
        if (_receiver == address(0)) revert InvalidReceiverAddress();
        _;
    }
    
    modifier onlySupportedToken(uint64 _chainSelector, address _token) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        if (!cs.supportedTokens[_chainSelector][_token])
            revert TokenNotSupported(_chainSelector, _token);
        _;
    }

    // ========== INITIALIZATION ==========
    
    function initializeCrossChain(
        address _router,
        address _link
    ) external onlyOwner {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        cs.router = IRouterClient(_router);
        cs.linkToken = IERC20(_link);
    }
    
    // ========== ADMIN FUNCTIONS ==========
    
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool _allowed
    ) external onlyOwner {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        cs.allowlistedChains[_destinationChainSelector] = _allowed;
        emit ChainAllowlisted(_destinationChainSelector, _allowed);
    }
    
    function setChainReceiver(
        uint64 _chainSelector,
        address _receiver
    ) external onlyOwner validateReceiver(_receiver) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        cs.chainReceivers[_chainSelector] = _receiver;
        emit ChainReceiverSet(_chainSelector, _receiver);
    }
    
    function addSupportedToken(
        uint64 _chainSelector,
        address _token
    ) external onlyOwner {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        cs.supportedTokens[_chainSelector][_token] = true;
        emit TokenSupportAdded(_chainSelector, _token);
    }
    
    // ========== USER PREFERENCE FUNCTIONS ==========
    
    function setBufferPaymentChain(
        uint64 _chainSelector,
        address _token
    ) external 
      onlyAllowlistedChain(_chainSelector)
      onlySupportedToken(_chainSelector, _token) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        cs.userBufferChain[msg.sender] = _chainSelector;
        cs.userBufferToken[msg.sender] = _token;
        emit BufferChainSet(msg.sender, _chainSelector, _token);
    }
    
    function setEmiPaymentChain(
        uint64 _chainSelector,
        address _token
    ) external 
      onlyAllowlistedChain(_chainSelector)
      onlySupportedToken(_chainSelector, _token) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        cs.userEmiChain[msg.sender] = _chainSelector;
        cs.userEmiToken[msg.sender] = _token;
        emit EmiChainSet(msg.sender, _chainSelector, _token);
    }
    
    // ========== CROSS-CHAIN BUFFER PAYMENT ==========
    
    function payBufferCrossChain(
        uint256 _amount,
        bool _payInNative
    ) external nonReentrant returns (bytes32 messageId) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        
        uint64 destinationChain = cs.userBufferChain[msg.sender];
        address token = cs.userBufferToken[msg.sender];
        
        if (destinationChain == 0) revert BufferChainNotSet(msg.sender);
        
        address receiver = cs.chainReceivers[destinationChain];
        if (receiver == address(0)) revert InvalidReceiverAddress();
        
        // Build CCIP message
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            receiver,
            token,
            _amount,
            _payInNative ? address(0) : address(cs.linkToken),
            abi.encode("BUFFER_PAYMENT", msg.sender, _amount)
        );
        
        // Calculate fees
        uint256 fees = cs.router.getFee(destinationChain, evm2AnyMessage);
        
        if (_payInNative) {
            if (fees > address(this).balance)
                revert NotEnoughBalance(address(this).balance, fees);
            
            // Transfer tokens from user
            IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);
            IERC20(token).approve(address(cs.router), _amount);
            
            messageId = cs.router.ccipSend{value: fees}(
                destinationChain,
                evm2AnyMessage
            );
        } else {
            if (fees > cs.linkToken.balanceOf(address(this)))
                revert NotEnoughBalance(cs.linkToken.balanceOf(address(this)), fees);
            
            // Transfer tokens from user
            IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);
            
            // Approve router for fees and tokens
            cs.linkToken.approve(address(cs.router), fees);
            IERC20(token).approve(address(cs.router), _amount);
            
            messageId = cs.router.ccipSend(destinationChain, evm2AnyMessage);
        }
        
        cs.messageFees[messageId] = fees;
        
        emit CrossChainBufferInitiated(
            messageId,
            msg.sender,
            destinationChain,
            token,
            _amount,
            fees
        );
        
        return messageId;
    }
    
    // ========== CROSS-CHAIN EMI PAYMENT ==========
    
    function setLoanEmiChain(
        uint256 _loanId,
        uint64 _chainSelector,
        address _token
    ) external 
      onlyAllowlistedChain(_chainSelector)
      onlySupportedToken(_chainSelector, _token) {
        // This should be called by loan creation logic
        // For now, allowing users to set their own
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        cs.loanEmiChain[_loanId] = _chainSelector;
        cs.loanEmiToken[_loanId] = _token;
    }
    
    function payEmiCrossChain(
        uint256 _loanId,
        uint256 _amount,
        bool _payInNative
    ) external nonReentrant returns (bytes32 messageId) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        
        uint64 destinationChain = cs.loanEmiChain[_loanId];
        address token = cs.loanEmiToken[_loanId];
        
        if (destinationChain == 0) revert EmiChainNotSet(msg.sender);
        
        address receiver = cs.chainReceivers[destinationChain];
        if (receiver == address(0)) revert InvalidReceiverAddress();
        
        // Build CCIP message with EMI payment data
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            receiver,
            token,
            _amount,
            _payInNative ? address(0) : address(cs.linkToken),
            abi.encode("EMI_PAYMENT", msg.sender, _loanId, _amount)
        );
        
        // Calculate fees
        uint256 fees = cs.router.getFee(destinationChain, evm2AnyMessage);
        
        if (_payInNative) {
            if (fees > address(this).balance)
                revert NotEnoughBalance(address(this).balance, fees);
            
            // Transfer tokens from user
            IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);
            IERC20(token).approve(address(cs.router), _amount);
            
            messageId = cs.router.ccipSend{value: fees}(
                destinationChain,
                evm2AnyMessage
            );
        } else {
            if (fees > cs.linkToken.balanceOf(address(this)))
                revert NotEnoughBalance(cs.linkToken.balanceOf(address(this)), fees);
            
            // Transfer tokens from user
            IERC20(token).safeTransferFrom(msg.sender, address(this), _amount);
            
            // Approve router for fees and tokens
            cs.linkToken.approve(address(cs.router), fees);
            IERC20(token).approve(address(cs.router), _amount);
            
            messageId = cs.router.ccipSend(destinationChain, evm2AnyMessage);
        }
        
        cs.messageFees[messageId] = fees;
        
        emit CrossChainEmiInitiated(
            messageId,
            msg.sender,
            _loanId,
            destinationChain,
            token,
            _amount,
            fees
        );
        
        return messageId;
    }
    
    // ========== VIEW FUNCTIONS ==========
    
    function getUserBufferChain(address _user) external view returns (uint64 chainSelector, address token) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        chainSelector = cs.userBufferChain[_user];
        token = cs.userBufferToken[_user];
    }
    
    function getUserEmiChain(address _user) external view returns (uint64 chainSelector, address token) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        chainSelector = cs.userEmiChain[_user];
        token = cs.userEmiToken[_user];
    }
    
    function getLoanEmiChain(uint256 _loanId) external view returns (uint64 chainSelector, address token) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        chainSelector = cs.loanEmiChain[_loanId];
        token = cs.loanEmiToken[_loanId];
    }
    
    function isChainAllowlisted(uint64 _chainSelector) external view returns (bool) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        return cs.allowlistedChains[_chainSelector];
    }
    
    function getChainReceiver(uint64 _chainSelector) external view returns (address) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        return cs.chainReceivers[_chainSelector];
    }
    
    function isTokenSupported(uint64 _chainSelector, address _token) external view returns (bool) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        return cs.supportedTokens[_chainSelector][_token];
    }
    
    function estimateCrossChainFees(
        uint64 _destinationChain,
        address _token,
        uint256 _amount,
        bool _payInNative,
        bytes memory _data
    ) external view returns (uint256 fees) {
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain.crossChainStorage();
        
        address receiver = cs.chainReceivers[_destinationChain];
        if (receiver == address(0)) revert InvalidReceiverAddress();
        
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            receiver,
            _token,
            _amount,
            _payInNative ? address(0) : address(cs.linkToken),
            _data
        );
        
        return cs.router.getFee(_destinationChain, evm2AnyMessage);
    }
    
    // ========== INTERNAL FUNCTIONS ==========
    
    function _buildCCIPMessage(
        address _receiver,
        address _token,
        uint256 _amount,
        address _feeTokenAddress,
        bytes memory _data
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });
        
        return Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: _data,
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.GenericExtraArgsV2({
                    gasLimit: 500000, // Increased gas limit for complex operations
                    allowOutOfOrderExecution: true
                })
            ),
            feeToken: _feeTokenAddress
        });
    }
    
    // ========== EMERGENCY FUNCTIONS ==========
    
    function withdrawToken(address _token, address _to, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(_to, _amount);
    }
    
    function withdrawNative(address payable _to, uint256 _amount) external onlyOwner {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed");
    }
    
    // Fallback to receive ETH
    receive() external payable {}
}