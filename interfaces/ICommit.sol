pragma solidity ^0.5.7;

/**
  * @title ICommit interface
  * @notice Provides the basic functionality of the Commit
  * contract.
  */
interface ICommit {
    function getCommitedFromBalance() external view returns(uint256);
    function getCommitedFromRented() external view returns(uint256);
    function commitFromBalance(uint256 numberOfTokens) external returns(bool);
    function commitToBalance(uint256 numberOfTokens) external returns(bool);
    function commitFromRented(uint256 numberOfTokens) external returns(bool);
    function commitToRented(uint256 numberOfTokens) external returns(bool);
}