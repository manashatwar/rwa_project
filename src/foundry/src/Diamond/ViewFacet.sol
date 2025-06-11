//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {DiamondStorage} from "./DiamondStorage.sol";

contract ViewFacet {
    function getUserNFTDetail(
        address _user,
        uint256 _tokenId
    ) public view returns (bool, uint256, uint256, uint256, address) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        return (
            ds.User[_user][_tokenId].isAuth,
            ds.User[_user][_tokenId].amount,
            ds.User[_user][_tokenId].duration,
            ds.User[_user][_tokenId].rate,
            ds.User[_user][_tokenId].tokenAddress
        );
    }

    function getUserNFTs(address _user) public view returns (uint256[] memory) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        return ds.userNftIds[_user];
    }

    /////
    function getLoanByAccountId(
        // This function retrieves the loan data for a specific account token ID
        uint256 accountTokenId
    ) external view returns (DiamondStorage.LoanData memory) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 generatedLoanId = ds.accountToLoans[accountTokenId];
        if (generatedLoanId == 0) {
            revert DiamondStorage.LoanDataNotFoundForLoanId(); // Or a more specific error
        }
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[
            generatedLoanId
        ];
        if (collateralTokenId == 0) {
            revert DiamondStorage.LoanDataNotFoundForLoanId(); // Or a more specific error
        }
        DiamondStorage.LoanData memory loan = ds.loans[collateralTokenId];
        // Integrity check
        if (loan.loanId != generatedLoanId || !loan.isActive) {
            revert DiamondStorage.LoanIdMismatch(); // Or LoanNotActive / DataNotFound
        }
        return loan;
    }

    function getUserLoans(
        address user
    ) external view returns (uint256[] memory) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        return ds.userLoans[user];
    }

    function calculateInterestRate(
        uint256 duration
    ) public pure returns (uint256) {
        // Base interest rate is 5% (500 basis points)
        uint256 baseRate = DiamondStorage.BASE_INTEREST_RATE;

        // Additional rate based on duration (longer duration = higher rate)
        // For each month over 30 days, add 0.5% (50 basis points)
        uint256 additionalRate = ((duration -
            DiamondStorage.MIN_LOAN_DURATION) * 50) / 30 days;

        // Cap the maximum additional rate at 5% (500 basis points)
        if (additionalRate > 500) {
            additionalRate = 500;
        }

        return baseRate + additionalRate;
    }

    // Also add the calculateTotalDebt function since it's used in AutomationLoan
    function calculateTotalDebt(
        uint256 amount,
        uint256 rate,
        uint256 duration
    ) public pure returns (uint256) {
        // Calculate interest: (amount * rate * duration) / (10000 * 365 days)
        // rate is in basis points (100 = 1%)
        uint256 interest = (amount * rate * duration) / (10000 * 365 days);
        return amount + interest;
    }

    function calculateTotalCurrentDebt(
        uint256 generatedLoanId
    ) public view returns (uint256) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[
            generatedLoanId
        ];
        if (collateralTokenId == 0) {
            return 0; // Or revert, depending on desired behavior for non-existent loanId
        }
        DiamondStorage.LoanData memory loan = ds.loans[collateralTokenId];

        if (!loan.isActive || loan.loanId != generatedLoanId) {
            // Check if the loan is active and doesn't match the generatedLoanId
            return 0;
        }

        // Calculate time elapsed since loan start
        uint256 timeElapsed = block.timestamp - loan.startTime;

        // If loan is past duration, return total debt
        if (timeElapsed >= loan.duration) {
            return loan.totalDebt;
        }

        // Calculate current debt based on elapsed time
        uint256 currentInterest = (loan.loanAmount *
            loan.interestRate *
            timeElapsed) / (10000 * 365 days);

        return loan.loanAmount + currentInterest;
    }

    /////
    function getUserInvestments(
        address _user
    )
        public
        view
        returns (
            uint256[] memory tokenIds,
            uint256[] memory amounts,
            bool[] memory authStatuses
        )
    {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256[] memory nftIds = ds.userNftIds[_user];
        uint256 length = nftIds.length;

        tokenIds = nftIds;
        amounts = new uint256[](length);
        authStatuses = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            // Make sure this NFT exists for this user
            uint256 tokenId = nftIds[i];
            if (ds.User[_user][tokenId].isAuth) {
                amounts[i] = ds.User[_user][tokenId].amount;
                authStatuses[i] = true;
            } else {
                amounts[i] = 0;
                authStatuses[i] = false;
            }
        }

        return (tokenIds, amounts, authStatuses);
    }

    /////@karun's function for validating loan creation
    function validateLoanCreationView(
        uint256 tokenId,
        uint256 duration
    ) external view {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();

        // Validate duration
        if (
            duration < DiamondStorage.MIN_LOAN_DURATION ||
            duration > DiamondStorage.MAX_LOAN_DURATION
        ) {
            revert DiamondStorage.InvalidLoanDuration();
        }

        uint256 numberOfPaymentPeriods = duration / 30 days;

        if (numberOfPaymentPeriods == 0) {
            revert DiamondStorage.InvalidLoanDuration();
        }

        // Check loan existence
        if (ds.loans[tokenId].isActive) {
            revert DiamondStorage.LoanAlreadyExists();
        }
    }

    function calculateLoanTerms(
        uint256 amount,
        uint256 duration
    ) external pure returns (uint256 totalDebt, uint256 bufferAmount) {
        uint256 interestRate = calculateInterestRate(duration);
        totalDebt = calculateTotalDebt(amount, interestRate, duration);
        bufferAmount = totalDebt - amount;
    }

    function getOverdueLoanIds(
        uint256 maxLoansToProcess
    ) external view returns (uint256[] memory overdueLoanIds, uint256 count) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        overdueLoanIds = new uint256[](maxLoansToProcess);
        count = 0;
        for (
            uint256 i = 1;
            i <= ds.currentLoanId && count < maxLoansToProcess;
            i++
        ) {
            uint256 collateralTokenId = ds.loanIdToCollateralTokenId[i];
            if (collateralTokenId == 0) {
                continue;
            }
            DiamondStorage.LoanData memory loan = ds.loans[collateralTokenId];
            if (loan.isActive && loan.loanId == i) {
                uint256 monthIndex = (block.timestamp - loan.startTime) /
                    30 days;
                if (
                    monthIndex < loan.monthlyPayments.length &&
                    !loan.monthlyPayments[monthIndex] &&
                    block.timestamp > loan.lastPaymentTime + 30 days
                ) {
                    overdueLoanIds[count] = i;
                    count++;
                }
            }
        }
    }

    // ========== CROSS-CHAIN VIEW FUNCTIONS ==========

    function isCrossChainEnabled() external view returns (bool) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        return ds.crossChainEnabled;
    }

    function getCrossChainBufferBalance(
        address _user
    ) external view returns (uint256) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        return ds.crossChainBufferBalance[_user];
    }

    function getLoanCrossChainInfo(
        uint256 _loanId
    )
        external
        view
        returns (
            bool useCrossChainBuffer,
            bool useCrossChainEmi,
            uint64 emiChainSelector,
            address emiTokenAddress
        )
    {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[_loanId];
        require(collateralTokenId != 0, "Loan does not exist");

        DiamondStorage.LoanData storage loan = ds.loans[collateralTokenId];
        return (
            loan.useCrossChainBuffer,
            loan.useCrossChainEmi,
            loan.emiChainSelector,
            loan.emiTokenAddress
        );
    }

    function getCrossChainFacetAddress() external view returns (address) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        return ds.crossChainFacet;
    }

    function getUserCrossChainLoans(
        address _user
    )
        external
        view
        returns (
            uint256[] memory loanIds,
            bool[] memory useCrossChainBuffer,
            bool[] memory useCrossChainEmi
        )
    {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256[] memory userLoanIds = ds.userLoans[_user];
        uint256 length = userLoanIds.length;

        loanIds = userLoanIds;
        useCrossChainBuffer = new bool[](length);
        useCrossChainEmi = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 loanId = userLoanIds[i];
            uint256 collateralTokenId = ds.loanIdToCollateralTokenId[loanId];
            if (collateralTokenId != 0) {
                DiamondStorage.LoanData storage loan = ds.loans[
                    collateralTokenId
                ];
                useCrossChainBuffer[i] = loan.useCrossChainBuffer;
                useCrossChainEmi[i] = loan.useCrossChainEmi;
            }
        }
    }

    function getLoanBufferStatus(
        uint256 _loanId
    )
        external
        view
        returns (
            uint256 totalBuffer,
            uint256 remainingBuffer,
            uint256 crossChainBuffer
        )
    {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[_loanId];
        require(collateralTokenId != 0, "Loan does not exist");

        DiamondStorage.LoanData storage loan = ds.loans[collateralTokenId];
        totalBuffer = loan.bufferAmount;
        remainingBuffer = loan.remainingBuffer;

        // Get cross-chain buffer for the borrower
        if (loan.useCrossChainBuffer) {
            crossChainBuffer = ds.crossChainBufferBalance[loan.borrower];
        }
    }

    function canUseCrossChainForEmi(
        uint256 _loanId
    ) external view returns (bool) {
        DiamondStorage.VaultState storage ds = DiamondStorage.getStorage();
        uint256 collateralTokenId = ds.loanIdToCollateralTokenId[_loanId];
        if (collateralTokenId == 0) return false;

        DiamondStorage.LoanData storage loan = ds.loans[collateralTokenId];
        return loan.useCrossChainEmi && loan.emiChainSelector != 0;
    }
}
