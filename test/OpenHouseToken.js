const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");

const configuration = require("../config.js");

contract("OpenHouseToken", accounts => {

    var tokenInstance;

    const admin = accounts[configuration.basicConfiguration.adminAccount];
    const spender = accounts[configuration.basicConfiguration.spenderAccount];
    const transferToAccount = accounts[configuration.basicConfiguration.transferToAccount];
    const noTokensAccount = accounts[configuration.basicConfiguration.noTokensAccount];
    const newOwnerAccount = accounts[configuration.basicConfiguration.newOwnerAccount];
    const commitAccount = accounts[configuration.basicConfiguration.commitAccount];

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
            return tokenInstance.getStatus();

        }).then(status => {

            assert.equal(status.toNumber(), configuration.basicConfiguration.status.activated, "Contract should be activated initially");

        });

    });

    it("Should allow or disallow the usage of certain function when contract is activated or deactivated respectively", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.getStatus();

        }).then(status => {

            assert.equal(status.toNumber(), configuration.basicConfiguration.status.activated, "Contract should be activated initially");
            return tokenInstance.deactivate({ from: spender });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Spender should not be able to deactivate contract");
            return tokenInstance.deactivate({ from: admin });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "Deactivated", "Should trigger the 'Deactivated' event");
            return tokenInstance.approve(spender, configuration.basicConfiguration.approvedTokens, { from: admin });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Approve function should not be usable");
            return tokenInstance.transfer(transferToAccount, configuration.basicConfiguration.transferedTokens, { from: admin });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Transfer function should not be usable");
            return tokenInstance.transferFrom(admin, transferToAccount, configuration.basicConfiguration.transferedTokens, { from: spender });
        
        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "TransferFrom function should not be usable");
            return tokenInstance.activate({from: spender });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Spender should not be able to activate the contract");
            return tokenInstance.activate({ from: admin });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "Activated", "Should trigger the 'Activated' event");

        });

    });

    it("Should be able to change ownership", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.getOwner();

        }).then(owner => {

            assert.equal(owner, admin, "Admin should be the owner of the contract initially");
            return tokenInstance.transferOwnership(newOwnerAccount, { from: spender });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Only the owner should be able to transfer the ownership of the contract");
            return tokenInstance.transferOwnership(newOwnerAccount, { from: admin });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "OwnershipTransfered", "Should trigger the 'OwnershipTransfered' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should transfer the ownership of the contract to newOwnerAccount");
            assert.equal(receipt.logs[0].args.to, newOwnerAccount, "NewOwnerAccount should receive the onwership of the contract");
            return tokenInstance.getOwner();

        }).then(owner => {

            assert.equal(owner, newOwnerAccount, "NewOwnerAccount should be the new owner of the contract");
            return tokenInstance.transferOwnership(admin, { from: newOwnerAccount });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "OwnershipTransfered", "Should trigger the 'OwnershipTransfered' event");
            assert.equal(receipt.logs[0].args.from, newOwnerAccount, "NewOwnerAccount should transfer the ownership of the contract to admin");
            assert.equal(receipt.logs[0].args.to, admin, "Admin should receive the onwership of the contract");
            return tokenInstance.getOwner();

        }).then(owner => {
            
            assert.equal(owner, admin, "Admin should be the final owner of the contract");

        });

    })

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

    it("Should be able to commit tokens from balance", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.transfer(commitAccount, configuration.basicConfiguration.transferedTokens, { from: transferToAccount });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "Transfer", "Should trigger the 'Transfer' event");
            assert.equal(receipt.logs[0].args.from, transferToAccount, "TransferToAccount should be the account the tokens are transfered from");
            assert.equal(receipt.logs[0].args.to, commitAccount, "CommitAccount should be the account the tokens are transfered to");
            assert.equal(receipt.logs[0].args.value, configuration.basicConfiguration.transferedTokens, "Should be equal to the transfered number of tokens");
            return tokenInstance.balanceOf(commitAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.transferedTokens, "CommitAccount should have available tokens");
            return tokenInstance.getCommitedFromBalance({ from: commitAccount });
            
        }).then(commitedFromBalance => {

            assert.equal(commitedFromBalance.toNumber(), 0, "CommitAccount should have zero tokens commited from balance initially");

        })

    });

    it("Should be able to commit tokens from rented", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.getCommitedFromRented({ from: commitAccount });

        }).then(commitedFromRented => {

            assert.equal(commitedFromRented.toNumber(), 0, "CommitAccount should have zero tokens commited from rented initially");

        })

    })

});