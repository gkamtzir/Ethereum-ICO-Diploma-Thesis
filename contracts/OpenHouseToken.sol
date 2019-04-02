pragma solidity ^0.5.7;

import "./IERC20.sol";

/**
    @title OpenHouseToken
    @author George Kamtziridis, gkamtzir@auth.gr
    @notice This is the core contract that implements the token.
 */
contract OpenHouseToken {
    string private name;
    string private symbol;
    uint256 private decimals;
    uint256 private _totalSupply;
    
    mapping(address => uint256) private _balanceOf;
    mapping(address => mapping(address => uint256)) _allowance;

    constructor() public {
        name = "OpenHouse Token";
        symbol = "OHT";
        decimals = 18;
    }

    /**
        @notice A getter function for the name variable.
        @return The name of the token.
     */
    function getName() public view returns(string memory) {
        return name;
    }

    /** 
        @notice A getter function for the symbol variable.
        @return The symbol of the token.
    */
    function getSymbol() public view returns(string memory) {
        return symbol;
    }

    /**
        @notice A getter function for the decimal variable
        @return The number of decimals the contract supports.
     */
    function getDecimals() public view returns(uint256) {
        return decimals;
    }

}