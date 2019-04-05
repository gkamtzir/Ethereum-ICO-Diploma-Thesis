pragma solidity ^0.5.7;

/**
  * @title ILeasingEvents interface
  * @notice Provides the needed events for the Leasing contract.
  */
interface ILeasingEvents {
    event OfferCreated(address from, uint256 numberOfTokens, uint256 price, uint256 duration);
    event OfferRemoved(address from);
    event LeasingTerminated(address from, address to);
    event Leased(address from, address to);
}