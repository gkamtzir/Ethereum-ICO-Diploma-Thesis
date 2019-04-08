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
    const rentAccount = accounts[configuration.basicConfiguration.rentAccount];

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
            return tokenInstance.commitFromBalance(configuration.basicConfiguration.commitFromBalance, { from: admin });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "CommitFromBalance function should not be usable");
            return tokenInstance.commitToBalance(0, { from: admin });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "CommitToBalance function should not be usable");
            return tokenInstance.createOffer(
                configuration.basicConfiguration.offerTokens,
                configuration.basicConfiguration.offerPrice,
                configuration.basicConfiguration.offerDuration
            );

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "CreateOffer function should not be usable");
            return tokenInstance.removeOffer({ from: admin });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "RemoveOffer function should not be usable");
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
            return tokenInstance.commitFromBalance(configuration.basicConfiguration.commitFromBalance, { from: commitAccount });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "CommitedFromBalance", "Should trigger the 'CommitedFromBalance' event");
            assert.equal(receipt.logs[0].args.from, commitAccount, "CommitAccount should have commited the tokens");
            assert.equal(receipt.logs[0].args.numberOfTokens, configuration.basicConfiguration.commitFromBalance, 
                "NumberOfTokens should be equal to the commited tokens");
            return tokenInstance.balanceOf(commitAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.transferedTokens
                - configuration.basicConfiguration.commitFromBalance, "CommitAccount's balance should decrease accordingly");
            return tokenInstance.getCommitedFromBalance({ from: commitAccount });

        }).then(commitedFromBalance => {

            assert.equal(commitedFromBalance.toNumber(), configuration.basicConfiguration.commitFromBalance, 
                "CommitAccount's commited tokens should increase accordingly");
            return tokenInstance.commitFromBalance(configuration.basicConfiguration.totalSupply, { from: commitAccount });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, 
                "Should throw an exception when commitAccount has insufficient number of tokens in balance");
            return tokenInstance.commitToBalance(configuration.basicConfiguration.commitToBalance, { from: commitAccount });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "CommitedToBalance", "Should trigger the 'CommitedToBalance' event");
            assert.equal(receipt.logs[0].args.from, commitAccount, "CommitAccount should have withdrawn the tokens");
            assert.equal(receipt.logs[0].args.numberOfTokens, configuration.basicConfiguration.commitToBalance, 
                "NumberOfTokens should be equal to the withdrawn tokens");
            return tokenInstance.getCommitedFromBalance({ from: commitAccount });

        }).then(commitedFromBalance => {

            assert.equal(commitedFromBalance.toNumber(), configuration.basicConfiguration.commitFromBalance
                - configuration.basicConfiguration.commitToBalance, "CommitAccount's commited from balance tokens should have decreased accordingly");
            return tokenInstance.balanceOf(commitAccount);

        }).then(balance => {

            assert.equal(balance.toNumber(), configuration.basicConfiguration.transferedTokens
                - configuration.basicConfiguration.commitFromBalance
                + configuration.basicConfiguration.commitToBalance, 
                "CommitAccount's balance should have increased accordingly");
            return tokenInstance.commitToBalance(configuration.basicConfiguration.commitFromBalance, { from: commitAccount });

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, 
                "Should throw an exception when commitAccount has insufficient number of tokens commited");

        });

    });

    it("Should be able to commit tokens from rented", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.getCommitedFromRented({ from: commitAccount });

        }).then(commitedFromRented => {

            assert.equal(commitedFromRented.toNumber(), 0, "CommitAccount should have zero tokens commited from rented initially");

        });

    });

    var adminNewBalance = configuration.basicConfiguration.totalSupply 
        - 2 *configuration.basicConfiguration.transferedTokens;
    var transferToAccountNewBalance = 2 *configuration.basicConfiguration.transferedTokens;

    it("Should be able to create offers and remove offers", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.createOffer(
                configuration.basicConfiguration.totalSupply,
                configuration.basicConfiguration.offerPrice,
                configuration.basicConfiguration.offerDuration
            );

        }).then(assert.fail).catch(error => {

            assert(error.message.indexOf("revert") >= 0, "Should throw an exception when user has insufficient tokens for leasing");
            return tokenInstance.getOfferNumberOfTokens(admin);

        }).then(offerNumberOfTokens => {

            assert.equal(offerNumberOfTokens.toNumber(), 0, "No offer should have been created");
            return tokenInstance.createOffer(
                configuration.basicConfiguration.offerTokens,
                configuration.basicConfiguration.offerPrice,
                configuration.basicConfiguration.offerDuration
            );

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "OfferCreated", "Should trigger the 'OfferCreated' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should be the account that created the offer");
            assert.equal(receipt.logs[0].args.numberOfTokens.toNumber(), configuration.basicConfiguration.offerTokens, 
                "Should be equal to the number of tokens admin chose to lease");
            assert.equal(receipt.logs[0].args.price.toNumber(), configuration.basicConfiguration.offerPrice, 
                "Should be equal to the price admin set");
            assert.equal(receipt.logs[0].args.duration.toNumber(), configuration.basicConfiguration.offerDuration,
                "Should be equal to the duration admin set");
            return tokenInstance.balanceOf(admin);

        }).then(balance => {

            assert.equal(balance.toNumber(), adminNewBalance - configuration.basicConfiguration.offerTokens,
                "Admin's balance should decrease accordingly");
            return tokenInstance.getOfferNumberOfTokens(admin);

        }).then(offerNumberOfTokens => {

            assert.equal(offerNumberOfTokens.toNumber(), configuration.basicConfiguration.offerTokens, 
                "Should be equal to the number of tokens admin chose to lease");
            return tokenInstance.getOfferPrice(admin);

        }).then(offerPrice => {

            assert.equal(offerPrice.toNumber(), configuration.basicConfiguration.offerPrice, "Should be equal to the price admin set");
            return tokenInstance.getOfferDuration(admin);

        }).then(offerDuration => {

            assert.equal(offerDuration.toNumber(), configuration.basicConfiguration.offerDuration,
                "Should be equal to the duration admin set");
            return tokenInstance.getOfferLeasedTo(admin);

        }).then(leasedTo => {

            assert.equal(leasedTo, "0x0000000000000000000000000000000000000000", "Should be leased to no-one initially");
            return tokenInstance.removeOffer({ from: admin });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "OfferRemoved", "Should trigger the 'OfferRemoved' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should be the account that removed the offer");
            return tokenInstance.getOfferNumberOfTokens(admin);

        }).then(offerNumberOfTokens => {

            assert.equal(offerNumberOfTokens.toNumber(), 0, "Admin's offer tokens should have been removed");
            return tokenInstance.getOfferPrice(admin);

        }).then(offerPrice => {

            assert.equal(offerPrice.toNumber(), 0, "Admin's offer price should have been removed");
            return tokenInstance.getOfferDuration(admin);

        }).then(offerDuration => {

            assert.equal(offerDuration.toNumber(), 0, "Admin's offer duration should have been removed");

        });

    });

    it("Should be able to rent tokens", () => {

        return OpenHouseToken.deployed().then(instance => {

            tokenInstance = instance;
            return tokenInstance.createOffer(
                configuration.basicConfiguration.offerTokens,
                configuration.basicConfiguration.offerPrice,
                configuration.basicConfiguration.offerDuration,
                { from: admin }
            );

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "OfferCreated", "Should trigger the 'OfferCreated' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should be the account that created the offer");
            assert.equal(receipt.logs[0].args.numberOfTokens.toNumber(), configuration.basicConfiguration.offerTokens, 
                "Should be equal to the number of tokens admin chose to lease");
            assert.equal(receipt.logs[0].args.price.toNumber(), configuration.basicConfiguration.offerPrice, 
                "Should be equal to the price admin set");
            assert.equal(receipt.logs[0].args.duration.toNumber(), configuration.basicConfiguration.offerDuration,
                "Should be equal to the duration admin set");
            return tokenInstance.leaseFrom(admin, { from: rentAccount, value: configuration.basicConfiguration.offerPrice });

        }).then(receipt => {

            assert.equal(receipt.logs.length, 1, "Should trigger one event");
            assert.equal(receipt.logs[0].event, "Leased", "Should trigger the 'Leased' event");
            assert.equal(receipt.logs[0].args.from, admin, "Admin should be the account whose tokens were rented");
            assert.equal(receipt.logs[0].args.to, rentAccount, "RentAccount should be the account who rented the tokens");
            return tokenInstance.getRentedNumberOfTokens(rentAccount);

        }).then(numberOfTokens => {

            assert.equal(numberOfTokens.toNumber(), configuration.basicConfiguration.offerTokens, "Should be equal to the rented tokens");
            return tokenInstance.getRentedAvailableTokens(rentAccount);

        }).then(availableTokens => {

            assert.equal(availableTokens.toNumber(), configuration.basicConfiguration.offerTokens, "Should be equal to the rented tokens initially");
            return tokenInstance.getRentedFrom(rentAccount);

        }).then(rentedFrom => {

            assert.equal(rentedFrom, admin, "Should be the address that created the offer");
            return tokenInstance.getOfferLeasedTo(admin);

        }).then(address => {

            assert.equal(address, rentAccount, "Should be the address that rented the tokens");

        });

    });

});