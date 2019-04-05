pragma solidity ^0.5.7;

/**
  * @title ICommit interface
  * @notice Provides the basic functionality of the Commit
  * contract.
  */
interface ICommit {
    function getCommitedFromBalance() external view returns(uint256);
    function getCommitedFromRented() external view returns(uint256);
}