pragma solidity ^0.5.7;

/**
  * @title ILeasing interface
  * @notice Provides the basic functionality of the Leasing
  * contract.
  */
interface ILeasing {
    function createOffer(uint256 numberOfTokens, uint256 price, uint256 duration) external returns(bool);
    function removeOffer() external returns(bool);
    function terminateLeasing() external returns(bool);
    function leaseFrom(address payable from) external payable returns(bool);
}