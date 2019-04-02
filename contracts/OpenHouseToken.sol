pragma solidity ^0.5.7;

/**
    @title OpenHouseToken
    @author George Kamtziridis, gkamtzir@auth.gr
    @notice This is the core contract that implements the token.
 */
contract OpenHouseToken {
    string private name;
    string private symbol;

    constructor() public {
        name = "OpenHouse Token";
        symbol = "OHT";
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

}