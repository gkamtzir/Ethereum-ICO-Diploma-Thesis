const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");

const configuration = require("../config.js");

contract("OpenHouseToken", accounts => {

    var tokenInstance;

    const admin = accounts[configuration.basicConfiguration.adminAccount];
    const spender = accounts[configuration.basicConfiguration.spenderAccount];
    const transferToAccount = accounts[configuration.basicConfiguration.transferToAccount];
    const noTokensAccount = accounts[configuration.basicConfiguration.noTokensAccount];

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
            assert.equal(receipt.logs[0].args.to, spender, "Spender should be the account the tokens are approved for");
            assert.equal(receipt.logs[0].args.value, configuration.basicConfiguration.approvedTokens, "Should be equal to the approved number of tokens");
            return tokenInstance.allowance(admin, spender);

        }).then(allowance => {

            assert.equal(allowance.toNumber(), configuration.basicConfiguration.approvedTokens, "Should return the correct allowance");

        });

    });

    it("Should be able to transfer tokens from one account to another", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.balanceOf(transferToAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), 0, "Should have zero tokens initially");
            return tokenInstance.balanceOf(admin);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.totalSupply, "Admin should initially have all the supply");
            return tokenInstance.transfer(transferToAccount, configuration.basicConfiguration.transferedTokens, { from: admin });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "Transfer", "Should trigger the 'Transfer' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should be the account the tokens are transfered from");
            assert.equal(receipt.logs[0].args.to, transferToAccount, "TransferToAccount should be the account the tokens are transfered to");
            assert.equal(receipt.logs[0].args.value, configuration.basicConfiguration.transferedTokens, "Should be equal to the transfered number of tokens");
            return tokenInstance.balanceOf(admin);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.totalSupply - configuration.basicConfiguration.transferedTokens,
                "Admin's balance should decrease accordingly");
            return tokenInstance.balanceOf(transferToAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.transferedTokens, "TransferToAccount's balance should increase accordingly");
            return tokenInstance.transfer(transferToAccount, configuration.basicConfiguration.transferedTokens, { from: noTokensAccount });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Should throw an exception when the sender's balance is less than the value");
            return tokenInstance.balanceOf(noTokensAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), 0, "NoTokensAccount's balance should be equal to zero");
            return tokenInstance.balanceOf(transferToAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.transferedTokens, "TransferToAccount's balance should remain the same");

        });

    });

    it("Should be able to transfer tokens on behalf of another account when those tokens are approved", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.transferFrom(admin, transferToAccount, configuration.basicConfiguration.transferedTokens, { from: spender });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "Transfer", "Should trigger the 'Transfer' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should be the account the tokens are transfered from");
            assert.equal(receipt.logs[0].args.to, transferToAccount, "TransferToAccount should be the account the tokens are transfered to");
            assert.equal(receipt.logs[0].args.value, configuration.basicConfiguration.transferedTokens, "Should be equal to the transfered number of tokens");
            return tokenInstance.balanceOf(admin);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.totalSupply 
                - 2 *configuration.basicConfiguration.transferedTokens, "Admin's balance should decreased accordingly");
            return tokenInstance.balanceOf(transferToAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), 2 * configuration.basicConfiguration.transferedTokens, "TransferToAccount's balance should increase accordingly");
            return tokenInstance.allowance(admin, spender);

        }).then(allowance => {

            assert.equal(allowance.toNumber(), 0, "Spender's allowance should decrease accordingly");
            return tokenInstance.transferFrom(admin, transferToAccount, configuration.basicConfiguration.transferedTokens, { from: spender });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Should throw an exception when spender's allowance is insufficient");
            return tokenInstance.balanceOf(admin);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.totalSupply 
                - 2 *configuration.basicConfiguration.transferedTokens, "Admin's balance should remain the same");
            return tokenInstance.balanceOf(transferToAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), 2 * configuration.basicConfiguration.transferedTokens, "TransferToAccount's balance should remain the same");
            return tokenInstance.allowance(admin, spender);

        }).then(allowance => {

            assert.equal(allowance.toNumber(), 0, "Spender's allowance should remain the same");
            return tokenInstance.approve(spender, configuration.basicConfiguration.totalSupply, { from: admin });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "Approval", "Should trigger the 'Approval' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should be the account the tokens are approved from");
            assert.equal(receipt.logs[0].args.to, spender, "Spender should be the account the tokens are approved for");
            assert.equal(receipt.logs[0].args.value, configuration.basicConfiguration.totalSupply, "Should be equal to the total supply");
            return tokenInstance.allowance(admin, spender);

        }).then(allowance => {

            assert.equal(allowance.toNumber(), configuration.basicConfiguration.totalSupply, "Spender's allowance should be equal to the total supply");
            return tokenInstance.transferFrom(admin, transferToAccount, configuration.basicConfiguration.totalSupply, { from: spender });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Should throw an exception when admin's balance is insufficient");
            return tokenInstance.balanceOf(admin);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.totalSupply 
                - 2 *configuration.basicConfiguration.transferedTokens, "Admin's balance should remain the same");
            return tokenInstance.balanceOf(transferToAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), 2 *configuration.basicConfiguration.transferedTokens, "TransferToAccount's balance should remain the same");
            return tokenInstance.allowance(admin, spender);

        }).then(allowance => {

            assert.equal(allowance.toNumber(), configuration.basicConfiguration.totalSupply, "Spender's allowance should remain the same");

        });

    });

});