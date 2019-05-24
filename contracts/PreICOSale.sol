pragma solidity 0.5.7;

/// Contracts.
import "./Sale.sol";

/**
  * @title PreICOSale
  * @author George Kamtziridis, gkamtzir@auth.gr
  * @notice This is the contract that implements the pre-ico sale.
  */
contract PreICOSale is Sale {

    constructor(
        address token,
        uint256 price,
        uint256 minCap,
        uint256 maxCap,
        uint256 tokenDecimals,
        uint256 start,
        uint256 end,
        uint256 redeemableAfter)
        Sale(
            token,
            price,
            minCap,
            maxCap,
            tokenDecimals,
            start,
            end,
            redeemableAfter)
        public
    {
        
    }

}