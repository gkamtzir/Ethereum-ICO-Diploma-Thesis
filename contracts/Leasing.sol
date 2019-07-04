pragma solidity 0.5.7;

/// Interfaces.
import "./interfaces/ILeasingEvents.sol";
import "./interfaces/ILeasing.sol";

/**
  * @title Leasing
  * @author George Kamtziridis, gkamtzir@auth.gr
  * @notice This is the contract that implements the basic leasing utilities.
  */
contract Leasing is ILeasingEvents, ILeasing {
    /// Structs.
    struct LeasingLog {
        uint256 numberOfTokens;
        uint256 price;
        uint256 duration;
        address leasedTo;
        uint256 leasedTimestamp;
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

    event Leased(
        address indexed from,
        address indexed to
    );

    event LeaseTerminated(
        address indexed from,
        address indexed to
    );

    mapping(address => LeasingLog) internal offer;
    mapping(address => Rented) internal rent;

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

    /**
      * @notice A getter function for the timestamp at which the offer got accepted.
      * @param from The address that created the offer.
      * @return The timestamp at which the offer got accepted.
      */
    function getOfferLeasedTimestamp(address from) public view returns(uint256) {
        return offer[from].leasedTimestamp;
    }

    /**
      * @notice A getter function for the number of tokens the given
      * address has rented.
      * @param from The address that rented the tokens.
      * @return The number of tokens that the given address
      * has currently rented.
      */
    function getRentedNumberOfTokens(address from) public view returns(uint256) {
        return rent[from].numberOfTokens;
    }

    /**
      * @notice A getter function for the available tokens of the given
      * address.
      * @param from The address that rented the tokens.
      * @return The number of available tokens the given address
      * currently has.
      */
    function getRentedAvailableTokens(address from) public view returns(uint256) {
        return rent[from].availableNumberOfTokens;
    }

    /**
      * @notice A getter function for the address from which the given address
      * has rented the tokens.
      * @param from The address that rented the tokens.
      * @return The address from which the given address has rented
      * the tokens.
      */
    function getRentedFrom(address from) public view returns(address) {
        return rent[from].rentedFrom;
    }

}