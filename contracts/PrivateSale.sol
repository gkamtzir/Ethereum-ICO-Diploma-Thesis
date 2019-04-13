pragma solidity ^0.5.7;

/// Contracts.
import "./Sale.sol";

contract PrivateSale is Sale {

    constructor(address token, uint256 price, uint256 minCap, uint256 maxCap)
        Sale(token, price, minCap, maxCap)
        public
    {
        
    }

}