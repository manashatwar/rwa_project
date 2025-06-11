// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
*
* Implementation of a diamond.
/******************************************************************************/

import {LibDiamond} from "../../lib/LibDiamond.sol";
import {IDiamondLoupe} from "../../interfaces/IDiamondLoupe.sol";
import {IDiamondCut} from "../../interfaces/IDiamondCut.sol";
import {IERC173} from "../../interfaces/IERC173.sol";
import {IERC165} from "../../interfaces/IERC165.sol";
import {LibCrossChain} from "../facets/CrossChainFacet.sol";
import {LibCrossChainReceiver} from "../facets/CrossChainReceiverFacet.sol";

// It is expected that this contract is customized if you want to deploy your diamond
// with data from a deployment script. Use the init function to initialize state variables
// of your diamond. Add parameters to the init function if you need to.

contract DiamondInit {
    struct InitParams {
        address ccipRouter;
        address linkToken;
        uint64[] allowlistedChains;
        address[] chainReceivers;
        address[] supportedTokens;
        uint64[] tokenChains;
    }

    // You can add parameters to this function in order to pass in
    // data to set your own state variables
    function init(InitParams calldata params) external {
        // adding ERC165 data
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;

        // Initialize Cross-Chain functionality
        _initializeCrossChain(params);

        // EIP-2535 specifies that the `diamondCut` function takes two optional
        // arguments: address _init and bytes calldata _calldata
        // These arguments are used to execute an arbitrary function using delegatecall
        // in order to set state variables in the diamond during deployment or an upgrade
        // More info here: https://eips.ethereum.org/EIPS/eip-2535#diamond-interface
    }

    function _initializeCrossChain(InitParams calldata params) internal {
        // Initialize CrossChain storage
        LibCrossChain.CrossChainStorage storage cs = LibCrossChain
            .crossChainStorage();

        // Set CCIP Router and LINK token
        if (params.ccipRouter != address(0)) {
            cs.router = IRouterClient(params.ccipRouter);
        }
        if (params.linkToken != address(0)) {
            cs.linkToken = IERC20(params.linkToken);
        }

        // Set allowlisted chains and their receivers
        require(
            params.allowlistedChains.length == params.chainReceivers.length,
            "Chains and receivers length mismatch"
        );

        for (uint256 i = 0; i < params.allowlistedChains.length; i++) {
            if (params.allowlistedChains[i] != 0) {
                cs.allowlistedChains[params.allowlistedChains[i]] = true;
                if (params.chainReceivers[i] != address(0)) {
                    cs.chainReceivers[params.allowlistedChains[i]] = params
                        .chainReceivers[i];
                }
            }
        }

        // Set supported tokens
        require(
            params.supportedTokens.length == params.tokenChains.length,
            "Tokens and chains length mismatch"
        );

        for (uint256 i = 0; i < params.supportedTokens.length; i++) {
            if (
                params.supportedTokens[i] != address(0) &&
                params.tokenChains[i] != 0
            ) {
                cs.supportedTokens[params.tokenChains[i]][
                    params.supportedTokens[i]
                ] = true;
            }
        }

        // Initialize CrossChain Receiver storage
        LibCrossChainReceiver.CrossChainReceiverStorage
            storage crs = LibCrossChainReceiver.crossChainReceiverStorage();

        if (params.ccipRouter != address(0)) {
            crs.router = params.ccipRouter;
        }

        // Authorize sender contracts on each chain (initially set to the same diamond addresses)
        for (uint256 i = 0; i < params.allowlistedChains.length; i++) {
            if (params.chainReceivers[i] != address(0)) {
                crs.authorizedSenders[params.allowlistedChains[i]][
                    params.chainReceivers[i]
                ] = true;
            }
        }
    }

    // Emergency initialization function for existing deployments
    function initializeCrossChainOnly(InitParams calldata params) external {
        LibDiamond.enforceIsContractOwner();
        _initializeCrossChain(params);
    }
}
