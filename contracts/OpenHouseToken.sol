pragma solidity ^0.5.7;

import "./IERC20.sol";

/**
  * @title OpenHouseToken
  * @author George Kamtziridis, gkamtzir@auth.gr
  * @notice This is the core contract that implements the token.
  */
contract OpenHouseToken {
    string private name;
    string private symbol;
    uint256 private decimals;
    uint256 private _totalSupply;
    
    mapping(address => uint256) private _balanceOf;
    mapping(address => mapping(address => uint256)) private _allowance;

    constructor(uint256 totalSupply) public {
        name = "OpenHouse Token";
        symbol = "OHT";
        decimals = 18;
        _totalSupply = totalSupply;
        _balanceOf[msg.sender] = _totalSupply;
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
      * @notice A getter function for the total supply.
      * @return The initial total supply of tokens in contract.
      */
    function totalSupply() external view returns(uint256) {
        return _totalSupply;
    }

    /**
      * @notice A getter function for the balance of an address.
      * @return The current balance of the given address.
      */
    function balanceOf(address owner) public view returns(uint256) {
        return _balanceOf[owner];
    }

}