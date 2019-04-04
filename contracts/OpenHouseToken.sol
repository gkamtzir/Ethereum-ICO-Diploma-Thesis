pragma solidity ^0.5.7;

/// Interfaces.
import "../interfaces/IERC20.sol";
import "../interfaces/IStatus.sol";

/// Libraries.
import "../libraries/SafeMath.sol";

/**
  * @title OpenHouseToken
  * @author George Kamtziridis, gkamtzir@auth.gr
  * @notice This is the core contract that implements the token.
  */
contract OpenHouseToken is IERC20, IStatus {
	using SafeMath for uint256;

    string private name;
    string private symbol;
    uint256 private decimals;
    uint256 private _totalSupply;

    address private _owner;

    Status private status;
    
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

    event Activated(
        uint256 indexed blockNumber
    );

    event Deactivated(
        uint256 indexed blockNumber
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

    /// Verifies that contract is active.
    modifier isActivated() {
        require(status == Status.Activated);
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
      * @notice A getter function for contract's status.
      * @return The current status of the contract.
      */
    function getStatus() public view returns(Status) {
        return status;
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

}