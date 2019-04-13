pragma solidity ^0.5.7;

/// Contracts.
import "./OpenHouseToken.sol";

/// Libraries.
import "../libraries/SafeMath.sol";

contract Sale {
    using SafeMath for uint256;

    address internal owner;
    OpenHouseToken internal tokenInstance;
    uint256 internal tokenPrice;
    uint256 internal tokensMinCap;
    uint256 internal tokensMaxCap;
    uint256 internal tokensSold;

    constructor(address token, uint256 price, uint256 minCap, uint256 maxCap) public {
        require(token != address(0));
        require(price > 0 && minCap > 0 && maxCap > 0);
        require(maxCap > minCap);

        owner = msg.sender;
        tokenInstance = OpenHouseToken(token);
        tokenPrice = price;
        tokensMinCap = minCap;
        tokensMaxCap = maxCap;
        tokensSold = 0;
    }

    /**
      * @notice A getter function for the owner of the private
      * sale.
      * @return The address of the owner of the private sale.
      */
    function getOwner() public view returns(address) {
        return owner;
    }

    /**
      * @notice A getter function for the price of the token.
      * @return The price of the token.
      */
    function getTokenPrice() public view returns(uint256) {
        return tokenPrice;
    }

    /**
      * @notice A getter function for the minumum cap of the tokens.
      * @return The minimum cap of the tokens.
      */
    function getTokensMinCap() public view returns(uint256) {
        return tokensMinCap;
    }

    /**
      * @notice A getter function for the maximum cap of the tokens.
      * @return The maximum cap of the tokens.
      */
    function getTokensMaxCap() public view returns(uint256) {
        return tokensMaxCap;
    }

    /**
      * @notice A getter function for the number of tokens
      * sold.
      * @return The number of tokens sold.
      */
    function getTokensSold() public view returns(uint256){
        return tokensSold;
    }

}