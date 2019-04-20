pragma solidity ^0.5.7;

/// Contracts.
import "./Sale.sol";

contract PreICOSale is Sale {

    constructor(
        address token,
        uint256 price,
        uint256 minCap,
        uint256 maxCap,
        uint256 start,
        uint256 end,
        uint256 redeemableAfter)
        Sale(
            token,
            price,
            minCap,
            maxCap,
            start,
            end,
            redeemableAfter)
        public
    {
        
    }

}