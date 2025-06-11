// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {DiamondStorage} from "./DiamondStorage.sol";
import {LibDiamond} from "./libraries/LibDiamond.sol";

contract Modifiers {
    modifier onlyOwner() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    modifier onlyAuthorized(address user, uint256 tokenId) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        require(ds.User[user][tokenId].isAuth, "User not authorized");
        _;
    }

    modifier validTokenId(uint256 tokenId) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        require(tokenId > 0 && tokenId <= ds._tokenIdCounter, "Invalid token ID");
        _;
    }

    modifier loanExists(uint256 loanId) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[loanId];
        require(collateralTokenId != 0, "Loan does not exist");
        require(ds.loans[collateralTokenId].isActive, "Loan not active");
        require(ds.loans[collateralTokenId].loanId == loanId, "Loan ID mismatch");
        _;
    }

    modifier onlyBorrower(uint256 loanId) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[loanId];
        require(ds.loans[collateralTokenId].borrower == msg.sender, "Not the borrower");
        _;
    }

    // Cross-chain specific modifiers
    modifier onlyCrossChainEnabled() {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        require(ds.crossChainEnabled, "Cross-chain functionality not enabled");
        _;
    }

    modifier onlyAuthorizedCaller() {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        // Allow owner, cross-chain facet, or contract itself
        require(
            msg.sender == LibDiamond.diamondStorage().contractOwner ||
            msg.sender == ds.crossChainFacet ||
            msg.sender == address(this),
            "Unauthorized caller"
        );
        _;
    }

    modifier crossChainLoanOnly(uint256 loanId) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[loanId];
        require(ds.loans[collateralTokenId].useCrossChainEmi, "Loan not set for cross-chain EMI");
        _;
    }
}