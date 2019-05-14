pragma solidity ^0.5.7;

/// Contracts.
import "./Sale.sol";

contract PrivateSale is Sale {

    mapping(address => bool) private allowedAddresses;

    /// Modifiers.

    /// Verifies that the sender is allowed to
    /// participate in the private sale.
    modifier isAllowed() {
        require(allowedAddresses[msg.sender]);
        _;
    }

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

    /**
      * @notice A getter function for the allowance of an address in the
      * private sale.
      * @param buyer The address to be checked.
      * @return A boolean indicating if the given address is allowed to
      * buy or not.
      */
    function getAddressAllowance(address buyer) public view returns(bool) {
        return allowedAddresses[buyer];
    }

    /**
      * @notice Allows the given address to participate to the
      * private sale.
      * @param buyer The address to be allowed.
      */
    function allowAddress(address buyer) public isActivated() onlyOwner() {
        allowedAddresses[buyer] = true;
    }

    /**
      * @notice Overrides the base 'buyTokens' function and uses the 'isAllowed'
      * modifier.
      * @param numberOfTokens The number of tokens the sender wants to buy.
      * @return A boolean value indicating if the purchase has completed successfully.
      */
    function buyTokens(uint256 numberOfTokens) public payable isAllowed() returns(bool) {
        super.buyTokens(numberOfTokens);
    }

}