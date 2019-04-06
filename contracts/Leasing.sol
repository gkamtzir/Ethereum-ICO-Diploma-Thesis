pragma solidity ^0.5.7;

/// Interfaces.
import "../interfaces/ILeasingEvents.sol";

contract Leasing is ILeasingEvents {
    /// Structs.
    struct LeasingLog {
        uint256 numberOfTokens;
        uint256 price;
        uint256 duration;
        address leasedTo;
    }

    struct Rented {
        uint256 numberOfTokens;
        uint256 availableNumberOfTokens;
        address rentedFrom;
    }

    /// Events.
    event OfferCreated(
        address indexed from,
        uint256 numberOfTokens,
        uint256 price,
        uint256 duration
    );

    event OfferRemoved(
        address indexed from
    );

    mapping(address => LeasingLog) internal offer;
    mapping(address => Rented) internal lent;

    /**
      * @notice A getter function for the number of tokens in
      * the specified address's offer.
      * @param from The address that created the offer.
      * @return The number of tokens the offer currently provides.
      */
    function getOfferNumberOfTokens(address from) public view returns(uint256) {
        return offer[from].numberOfTokens;
    }

    /**
      * @notice A getter function for the price of the specified 
      * address's offer.
      * @param from The address that created the offer.
      * @return The price of the offer.
      */
    function getOfferPrice(address from) public view returns(uint256) {
        return offer[from].price;
    }

    /**
      * @notice A getter function for the duration of the specified 
      * address's offer.
      * @param from The address that created the offer.
      * @return The duration of the offer.
      */
    function getOfferDuration(address from) public view returns(uint256) {
        return offer[from].duration;
    }

    /**
      * @notice A getter function for the address that accepted the specified 
      * address's offer.
      * @param from The address that created the offer.
      * @return The address that currently rented from the specified address.
      */
    function getOfferLeasedTo(address from) public view returns(address) {
        return offer[from].leasedTo;
    }

}