pragma solidity ^0.5.7;

/// Contracts.
import "./Commit.sol";
import "./Leasing.sol";
import "./Status.sol";

/// Interfaces.
import "../interfaces/IERC20.sol";

/// Libraries.
import "../libraries/SafeMath.sol";

/**
  * @title OpenHouseToken
  * @author George Kamtziridis, gkamtzir@auth.gr
  * @notice This is the core contract that implements the token.
  */
contract OpenHouseToken is IERC20, Status, Commit, Leasing {
	using SafeMath for uint256;

    string private name;
    string private symbol;
    uint256 private decimals;
    uint256 private _totalSupply;

    address private _owner;
    
    mapping(address => uint256) private _balanceOf;
    mapping(address => mapping(address => uint256)) private _allowance;

    /// Events.

    event Approval(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Transfer(
      address indexed from,
      address indexed to,
      uint256 value
    );

    event OwnershipTransfered(
        address indexed from,
        address indexed to
    );

    /// Modifiers.

    /// Verifies that sender is the owner of the contract.
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    constructor(uint256 totalSupply) public {
        name = "OpenHouse Token";
        symbol = "OHT";
        decimals = 18;
        _totalSupply = totalSupply;
        _balanceOf[msg.sender] = _totalSupply;
        _owner = msg.sender;
        status = Status.Activated;
    }

    /**
      * @notice A getter function for the name variable.
      * @return The name of the token.
      */
    function getName() public view returns(string memory) {
        return name;
    }

    /** 
      * @notice A getter function for the symbol variable.
      * @return The symbol of the token.
      */
    function getSymbol() public view returns(string memory) {
        return symbol;
    }

    /**
      * @notice A getter function for the decimal variable.
      * @return The number of decimals the contract supports.
      */
    function getDecimals() public view returns(uint256) {
        return decimals;
    }

    /**
      * @notice A getter function for the onwer of the smart contract.
      * @return The address of the owner of the smart contract.
      */
    function getOwner() public view returns(address) {
        return _owner;
    }

    /**
      * @notice A getter function for the total supply.
      * @return The initial total supply of tokens in contract.
      */
    function totalSupply() public view returns(uint256) {
        return _totalSupply;
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

    function transferOwnership(address newOwner) public onlyOwner() returns(bool) {
        _owner = newOwner;

        emit OwnershipTransfered(msg.sender, newOwner);

        return true;
    }

    /**
      * @notice A getter function for the balance of an address.
      * @param owner The address of a wallet.
      * @return The current balance of the given address.
      */
    function balanceOf(address owner) public view returns(uint256) {
        return _balanceOf[owner];
    }

    /**
      * @notice Approves the spending of a specified number of tokens from
      * the msg.sender to the given spender.
      * @param spender The account which is approved to spend the tokens.
      * @param value The number of tokens that are approved to be spent.
      * @return A boolean indicating if the approval has completed successfully. 
      */
    function approve(address spender, uint256 value) public isActivated() returns(bool) {
        _allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

    /**
      * @notice A getter function for the allowance of token spending from
      * one address to another.
      * @param owner The account the tokens are approved from.
      * @param spender The account the tokens are approved for.
      * @return The number of tokens approved.
      */
    function allowance(address owner, address spender) public view returns(uint256) {
        return _allowance[owner][spender];
    }

	/**
	  * @notice Transfers the given amount of tokens to the given
	  * address from msg.sender.
	  * @param to The address of the receiver.
	  * @param value The amount of tokens to be sent.
	  * @return A boolean indicating if the transfer has completed successfully.
	  */
    function transfer(address to, uint256 value) public isActivated() returns(bool) {
        require(_balanceOf[msg.sender] >= value);

        _balanceOf[msg.sender] -= value;
        _balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);

        return true;
    }

    /**
      * @notice Transfers tokens on behalf of another account.
      * @param from The account from which the tokens will be transfered.
      * @param to The account to which the the tokens will be transfered.
      * @param value The number of tokens to be transfered.
      * @return A boolean indicating if the transfer has completed successfully.
      */
    function transferFrom(address from, address to, uint256 value) public isActivated() returns(bool) {
        require(_allowance[from][msg.sender] >= value);
        require(_balanceOf[from] >= value);

        _balanceOf[from] -= value;
        _balanceOf[to] += value;

        _allowance[from][msg.sender] -= value;

        emit Transfer(from, to, value);

        return true;
    }

    /**
      * @notice Commits the specified amount of tokens from sender's balance.
      * @param numberOfTokens The amount of tokens to be commited from balance.
      * @return A boolean indicating if the commit has completed successfully.
      */
    function commitFromBalance(uint256 numberOfTokens) public isActivated() returns(bool) {
        require(_balanceOf[msg.sender] >= numberOfTokens);

        _balanceOf[msg.sender] -= numberOfTokens;
        commited[msg.sender].fromBalance += numberOfTokens;

        emit CommitedFromBalance(msg.sender, numberOfTokens);

        return true;
    }

    /**
      * @notice Withdraws the specified amount of tokens back to sender's balance.
      * @param numberOfTokens The amount of tokens to be withdrawn back to balance.
      * @return A boolean indicating if the withdrawal has completed successfully.
      */
    function commitToBalance(uint256 numberOfTokens) public isActivated() returns(bool) {
        require(commited[msg.sender].fromBalance >= numberOfTokens);

        commited[msg.sender].fromBalance -= numberOfTokens;
        _balanceOf[msg.sender] += numberOfTokens;

        emit CommitedToBalance(msg.sender, numberOfTokens);

        return true;
    }

    /**
      * @notice Commits the specified amount of tokens from sender's rented tokens.
      * @param numberOfTokens The amount of tokens to be commited from the rented tokens.
      * @return A boolean indicating if the commit has completed successfully.
      */
    function commitFromRented(uint256 numberOfTokens) public isActivated() returns(bool) {
        require(rent[msg.sender].rentedFrom != address(0));
        require(rent[msg.sender].availableNumberOfTokens >= numberOfTokens);

        rent[msg.sender].availableNumberOfTokens -= numberOfTokens;
        commited[msg.sender].fromRented += numberOfTokens;

        emit CommitedFromRented(msg.sender, numberOfTokens);

        return true;
    }

    /**
      * @notice Withdraws the specified amount of tokens back to sender's rented tokens.
      * @param numberOfTokens The amount of tokens to be withdrawn back to rented tokens.
      * @return A boolean indicating if the withdrawal has completed successfully.
      */
    function commitToRented(uint256 numberOfTokens) public isActivated() returns(bool) {
        require(rent[msg.sender].rentedFrom != address(0));
        require(commited[msg.sender].fromRented >= numberOfTokens);

        commited[msg.sender].fromRented -= numberOfTokens;
        rent[msg.sender].availableNumberOfTokens += numberOfTokens;

        emit CommitedToRented(msg.sender, numberOfTokens);

        return true;
    }

    /**
      * @notice Creates and offer to lease tokens.
      * @param numberOfTokens The number of tokens to be leased.
      * @param price The price of the leasing.
      * @param duration The duration of the leasing in number of blocks.
      * @return A boolean indicating if the offer was created successfully.
      */
    function createOffer(uint256 numberOfTokens, uint256 price, uint256 duration) public isActivated() returns(bool) {
        require(_balanceOf[msg.sender] >= numberOfTokens && numberOfTokens > 0);
        require(offer[msg.sender].leasedTo == address(0) && offer[msg.sender].numberOfTokens == 0);
        /// Making sure that the price has a non-zero value and the minimum duration
        /// is approximately 1 hour (3600 seconds).
        require(price > 0 && duration >= 3600);

        _balanceOf[msg.sender] -= numberOfTokens;

        offer[msg.sender].numberOfTokens = numberOfTokens;
        offer[msg.sender].price = price;
        offer[msg.sender].duration = duration;

        emit OfferCreated(msg.sender, numberOfTokens, price, duration);
        
        return true;
    }

    /**
      * @notice Removes sender's existing offer.
      * @return A boolean indicating if the removal has completed successfully.
      */
    function removeOffer() public isActivated() returns(bool) {
        require(offer[msg.sender].leasedTo == address(0));

        uint256 numberOfTokens = offer[msg.sender].numberOfTokens;

        offer[msg.sender].numberOfTokens = 0;
        offer[msg.sender].price = 0;
        offer[msg.sender].duration = 0;

        _balanceOf[msg.sender] += numberOfTokens;

        emit OfferRemoved(msg.sender);

        return true;
    }

    /**
      * @notice Rents tokens from the specified address's offer.
      * @param from The address from which the offer will be accepted.
      * @return A boolean indicating if the rent has completed successfully.
      */
    function leaseFrom(address payable from) public isActivated() payable returns(bool) {
        require(rent[msg.sender].rentedFrom == address(0));
        require(offer[from].leasedTo == address(0));
        require(msg.value == offer[from].price);

        uint256 numberOfTokens = offer[from].numberOfTokens;

        offer[from].leasedTo = msg.sender;
        offer[from].leasedTimestamp = block.timestamp;
        offer[from].numberOfTokens = 0;

        rent[msg.sender].rentedFrom = from;
        rent[msg.sender].numberOfTokens = numberOfTokens;
        rent[msg.sender].availableNumberOfTokens = numberOfTokens;

        /// Transfer ether.
        from.transfer(msg.value);

        emit Leased(from, msg.sender);

        return true;
    }

    /**
      * @notice Terminates the leasing of the sender.
      * @return A boolean indicating if the termination has completed successfully.
      */
    function terminateLeasing() public isActivated() returns(bool) {
        require(offer[msg.sender].leasedTo != address(0));
        require(block.timestamp >= offer[msg.sender].leasedTimestamp + offer[msg.sender].duration);

        address to = offer[msg.sender].leasedTo;
        uint256 numberOfTokens = rent[to].numberOfTokens;

        /// Clearing all commited tokens that are rented.
        commited[to].fromRented = 0;
        
        /// Clearing the rent instance.
        rent[to].availableNumberOfTokens = 0;
        rent[to].numberOfTokens = 0;
        rent[to].rentedFrom = address(0);

        /// Clearing the offer instance.
        offer[msg.sender].leasedTo = address(0);
        offer[msg.sender].leasedTimestamp = 0;
        offer[msg.sender].numberOfTokens = numberOfTokens;

        emit LeasingTerminated(msg.sender, to);

        return true;
    }

}