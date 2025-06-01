// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

library DiamondStorage {
    //constant types

    struct UserAccount {
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
