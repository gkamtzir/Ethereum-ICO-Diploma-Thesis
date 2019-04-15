pragma solidity ^0.5.7;

/// Contracts.
import "./OpenHouseToken.sol";
import "./Status.sol";

/// Libraries.
import "../libraries/SafeMath.sol";

contract Sale is Status {
    using SafeMath for uint256;

    address internal owner;
    OpenHouseToken internal tokenInstance;
    uint256 internal tokenPrice;
    uint256 internal tokensMinCap;
    uint256 internal tokensMaxCap;
    uint256 internal tokensSold;

    uint256 internal startTimestamp;
    uint256 internal endTimestamp;
    uint256 internal redeemableAfterTimestamp;

    mapping(address => uint256) internal balanceOf;

    /// Modifiers.

    /// Verifies that sender is the owner of the contract.
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /// Verifies that sale is in progress.
    modifier isLive() {
        require(block.timestamp >= startTimestamp && block.timestamp <= endTimestamp);
        _;
    }

    /// Events.
    event Sold(
        address indexed from,
        uint256 numberOfTokens
    );

    constructor(
        address token, 
        uint256 price,
        uint256 minCap,
        uint256 maxCap,
        uint256 start,
        uint256 end,
        uint256 redeemableAfter) 
        public
    {
        require(token != address(0));
        require(price > 0 && minCap > 0 && maxCap > 0);
        require(maxCap > minCap);

        owner = msg.sender;
        tokenInstance = OpenHouseToken(token);
        tokenPrice = price;
        tokensMinCap = minCap;
        tokensMaxCap = maxCap;
        startTimestamp = start;
        endTimestamp = end;
        redeemableAfterTimestamp = redeemableAfter;
        tokensSold = 0;
        status = Status.Activated;
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

    /**
      * @notice A getter function for sale's starting timestamp.
      * @return The timestamp when the sale will begin.
      */
    function getStartTimestamp() public view returns(uint256) {
        return startTimestamp;
    }

    /**
      * @notice A getter function for sale's ending timestamp.
      * @return The timestamp when the sale will end.
      */
    function getEndTimestamp() public view returns(uint256) {
        return endTimestamp;
    }

    /**
      * @notice A getter function for timestamp after which the
      * tokens will be redeemamble.
      * @return The timestamp when the tokens will be redeemable.
      */
    function getRedeemableAfterTimestamp() public view returns(uint256) {
        return redeemableAfterTimestamp;
    }

    /**
      * @notice Activates the contract.
      * @return A boolean indicating if the activation has completed
      * successfully
      */
    function activate() public onlyOwner() returns(bool) {
        status = Status.Activated;

        emit Activated(block.number);

        return true;
    }

    /**
      * @notice Deactivates the contract.
      * @return A boolean indicating if the deactivation has completed
      * successfully
      */
    function deactivate() public onlyOwner() returns(bool){
        status = Status.Deactivated;

        emit Deactivated(block.number);

        return true;
    }

    function buyTokens(uint256 numberOfTokens) public payable isActivated() isLive() returns(bool) {
        require(tokenInstance.balanceOf(address(this)) - tokensSold >= numberOfTokens);
        require(msg.value == numberOfTokens * tokenPrice);

        tokensSold -= numberOfTokens;
        balanceOf[msg.sender] += numberOfTokens;

        emit Sold(msg.sender, numberOfTokens);

        return true;
    }

}