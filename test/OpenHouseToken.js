const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");

const configuration = require("../config.js");

contract("OpenHouseToken", accounts => {

    var tokenInstance;

    it("should initialize the contract with the correct values", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.getName();

        }).then(name => {

            assert.equal(name, configuration.basicConfiguration.name, "Should have the correct name");
            return tokenInstance.getSymbol();

        }).then(symbol => {

            assert.equal(symbol, configuration.basicConfiguration.symbol, "Should have the correct symbol");
            return tokenInstance.getDecimals();

        }).then(decimals => {

            assert.equal(decimals.toNumber(), configuration.basicConfiguration.decimals, "Should have the correct number of decimal points");
            return tokenInstance.totalSupply();

        }).then(totalSupply => {

            assert.equal(totalSupply.toNumber(), configuration.basicConfiguration.totalSupply, "Should have the correct initial total supply");

        });

    });

});