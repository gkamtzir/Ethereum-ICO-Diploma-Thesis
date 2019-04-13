pragma solidity ^0.5.7;

/// Contracts.
import "./OpenHouseToken.sol";

/// Libraries.
import "../libraries/SafeMath.sol";

contract Sale {
    using SafeMath for uint256;

    address internal admin;
    OpenHouseToken internal tokenInstance;
    uint256 internal tokenPrice;
    uint256 internal tokensMinCap;
    uint256 internal tokensMaxCap;
    uint256 internal tokensSold;

    constructor(address token, uint256 price, uint256 minCap, uint256 maxCap) public {
        require(token != address(0));
        require(price > 0 && minCap > 0 && maxCap > 0);
        require(maxCap > minCap);

        admin = msg.sender;
        tokenInstance = OpenHouseToken(token);
        tokenPrice = price;
        tokensMinCap = minCap;
        tokensMaxCap = maxCap;
        tokensSold = 0;
    }

}