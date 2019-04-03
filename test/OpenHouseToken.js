const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");

const configuration = require("../config.js");

contract("OpenHouseToken", accounts => {

    var tokenInstance;

    const admin = accounts[configuration.basicConfiguration.adminAccount];
    const spender = accounts[configuration.basicConfiguration.spenderAccount];

    it("Should initialize the contract with the correct values", () => {

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
            return tokenInstance.getOwner();

        }).then(owner => {

            assert.equal(owner, admin, "Owner should be the admin");
            return tokenInstance.balanceOf(admin);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.totalSupply, "Should have allocated the initial supply to the owner");

        });

    });

    it("Should be able to approve the spending of a specified number of tokens from one account to another", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.approve(spender, configuration.basicConfiguration.approvedTokens, { from: admin });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "Approval", "Should trigger the 'Approval' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should be the account the tokens are approved from");
            assert.equal(receipt.logs[0].args.to, spender, "Spender should be the account the tokens are approved to");
            assert.equal(receipt.logs[0].args.value, configuration.basicConfiguration.approvedTokens, "Should be equal to the approved number of tokens");

        });

    });

});