pragma solidity ^0.5.7;

/// Interfaces.
import "../interfaces/ILeasingEvents.sol";

contract Leasing is ILeasingEvents {
    /// Structs.
    struct LeasingLog {
        uint256 numberOfTokens;
        uint256 price;
        uint256 duration;
        address leaseTo;
    }

    struct Rented {
        uint256 numberOfTokens;
        uint256 availableNumberOfTokens;
        address rentedFrom;
    }

    mapping(address => LeasingLog) internal offer;
    mapping(address => Rented) internal lent;
}