const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");

contract("OpenHouseToken", accounts => {

    var tokenInstance;

    it("should initialize the contract with the correct values", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.getName();

        }).then(name => {

            assert.equal(name, "OpenHouse Token", "Should have the correct name");
            return tokenInstance.getSymbol();

        }).then(symbol => {

            assert.equal(symbol, "OHT", "Should have the correct symbol");
            return tokenInstance.getDecimals();

        }).then(decimals => {

            assert.equal(decimals.toNumber(), 18, "Should have the correct number of decimal points");

        });

    });

});