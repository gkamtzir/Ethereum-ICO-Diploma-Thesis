pragma solidity 0.5.7;

/// Contracts.
import "./OpenHouseToken.sol";
import "./Status.sol";

/// Libraries.
import "./libraries/SafeMath.sol";

/**
  * @title Sale
  * @author George Kamtziridis, gkamtzir@auth.gr
  * @notice This is the contract that implements the sale.
  */
contract Sale is Status {
    using SafeMath for uint256;

    address payable internal owner;
    OpenHouseToken internal tokenInstance;
    uint256 internal tokenPrice;
    uint256 internal tokensMinCap;
    uint256 internal tokensMaxCap;
    uint256 internal tokensSold;
    uint256 internal decimals;

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

    /// Verifies that the sale is in progress.
    modifier isLive() {
        require(block.timestamp >= startTimestamp && block.timestamp <= endTimestamp);
        _;
    }

    /// Verifies that the sale has ended.
    modifier hasEnded() {
        require(block.timestamp > endTimestamp);
        _;
    }

    /// Verifies that tokens are redeemable.
    modifier areRedeemable() {
        require(block.timestamp > redeemableAfterTimestamp);
        _;
    }

    /// Events.
    event Sold(
        address indexed from,
        uint256 numberOfTokens
    );

    event Refunded(
        address indexed from,
        uint256 numberOfTokens
    );

    event Redeemed(
        address indexed from,
        uint256 numberOfTokens
    );

    event Reallocated(
        address indexed from,
        uint256 numberOfTokens
    );

    event OwnershipTransfered(
        address indexed from,
        address indexed to
    );

    constructor(
        address token, 
        uint256 price,
        uint256 minCap,
        uint256 maxCap,
        uint256 tokenDecimals,
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
        decimals = tokenDecimals;
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
      * @notice A getter function for the current balance of an address.
      * @return The number of tokes bought by the given address.
      */
    function getBalanceOf(address buyer) public view returns(uint256) {
        return balanceOf[buyer];
    }

    /**
      * @notice Activates the contract.
      * @return A boolean indicating if the activation has completed
      * successfully.
      */
    function activate() public onlyOwner() returns(bool) {
        status = Status.Activated;

        emit Activated(block.number);

        return true;
    }

    /**
      * @notice Deactivates the contract.
      * @return A boolean indicating if the deactivation has completed
      * successfully.
      */
    function deactivate() public onlyOwner() returns(bool){
        status = Status.Deactivated;

        emit Deactivated(block.number);

        return true;
    }

    /**
      * @notice Transfers the ownership of the contract.
      * @return A boolean value indicating if the transfer has completed successfully.
      */
    function transferOwnership(address payable newOwner) public onlyOwner() returns(bool) {
        owner = newOwner;

        emit OwnershipTransfered(msg.sender, newOwner);

        return true;
    }

    /**
      * @notice Enables sender to buy tokens.
      * @param numberOfTokens The number of tokens the sender wants to buy.
      * @return A boolean value indicating if the purchase has completed successfully.
      */
    function buyTokens(uint256 numberOfTokens) public payable isActivated() isLive() returns(bool) {
        require(tokensMaxCap.sub(tokensSold) >= numberOfTokens);
        require(msg.value == numberOfTokens.mul(tokenPrice));

        tokensSold = tokensSold.add(numberOfTokens);
        balanceOf[msg.sender] = balanceOf[msg.sender].add(numberOfTokens);

        emit Sold(msg.sender, numberOfTokens);

        return true;
    }

    /**
      * @notice Refunds sender's tokens when sale has failed.
      * @return A boolean value indicating if the refund has completed successfully.
      */
    function refundTokens() public isActivated() hasEnded() returns(bool) {
        require(tokensSold < tokensMinCap);
        require(balanceOf[msg.sender] > 0);

        uint256 balance = balanceOf[msg.sender];

        balanceOf[msg.sender] = 0;

        msg.sender.transfer(balance.mul(tokenPrice));

        emit Refunded(msg.sender, balance);

        return true;
    }

    /**
      * @notice Redeems sender's token when sale has completed.
      * @return A boolean value indicating if the retrieval of
      * the tokens has completed successfully.
      */
    function redeemTokens() public isActivated() hasEnded() areRedeemable() returns(bool) {
        require(tokensSold >= tokensMinCap);
        require(balanceOf[msg.sender] > 0);

        uint256 balance = balanceOf[msg.sender];

        balanceOf[msg.sender] = 0;

        require(tokenInstance.transfer(msg.sender, balance.mul(10 ** decimals)));

        emit Redeemed(msg.sender, balance);

        return true;
    }

    /**
      * @notice Reallocates the remaining tokens and the raised
      * ether (if the sale has completed successfully) back to admin.
      * @return A boolean indicating if the reallocation has completed successfully.
      */
    function reallocateTokens() public isActivated() hasEnded() onlyOwner() returns(bool) {
        uint256 numberOfTokens;

        if (tokensSold >= tokensMinCap) {
            numberOfTokens = tokensMaxCap.sub(tokensSold);
            owner.transfer(tokensSold.mul(tokenPrice));
        } else {
            numberOfTokens = tokensMaxCap;
        }

        require(tokenInstance.transfer(owner, numberOfTokens.mul(10 ** decimals)));

        emit Reallocated(owner, numberOfTokens);

        return true;
    }

}