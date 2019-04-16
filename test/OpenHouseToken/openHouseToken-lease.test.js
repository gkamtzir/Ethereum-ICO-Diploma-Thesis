const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const truffleAssert = require("truffle-assertions");

const { increaseTime, duration } = require("../helpers/increaseTime");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract("OpenHouseToken -> lease", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];
        this.rentAccount = accounts[basicConfiguration.rentAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];
        
        await this.token.createOffer(
            basicConfiguration.offerTokens,
            basicConfiguration.offerPrice,
            basicConfiguration.offerDuration,
            { from: this.admin }
        );

        await this.token.transfer(this.transferToAccount, basicConfiguration.offerTokens / 10, 
            { from: this.admin });

        await this.token.createOffer(
            basicConfiguration.offerTokens / 10,
            basicConfiguration.offerPrice,
            basicConfiguration.offerDuration,
            { from: this.transferToAccount }
        )
    });

    describe("Lease", () => {

        it("Should be able to lease", async () => {
            const tx = await this.token.leaseFrom(this.admin, 
                { from: this.rentAccount, value: basicConfiguration.offerPrice})
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Leased", event => {
                return event.from === this.admin && event.to === this.rentAccount;
            });

            const block = await web3.eth.getBlock(tx.receipt.logs[0].blockNumber);
            this.timestamp = block.timestamp;
        });

        it("Should be able to create the rent instance properly", async () => {
            const numberOfTokens = await this.token.getRentedNumberOfTokens(this.rentAccount);
            numberOfTokens.toNumber().should.be.equal(basicConfiguration.offerTokens);

            const availableTokens = await this.token.getRentedAvailableTokens(this.rentAccount);
            availableTokens.toNumber().should.be.equal(basicConfiguration.offerTokens);

            const rentedFrom = await this.token.getRentedFrom(this.rentAccount);
            rentedFrom.should.be.equal(this.admin);
        });

        it("Should be able to modify the offer instance properly", async () => {
            const leasedTo = await this.token.getOfferLeasedTo(this.admin);
            leasedTo.should.be.equal(this.rentAccount);

            const leasedTimestamp = await this.token.getOfferLeasedTimestamp(this.admin);
            leasedTimestamp.toNumber().should.be.equal(this.timestamp);

            // Commits some of the rented tokens.
            await this.token.commitFromRented(basicConfiguration.offerTokens / 100, { from: this.rentAccount });
            const commited = await this.token.getCommitedFromRented({ from: this.rentAccount });
            commited.toNumber().should.be.equal(basicConfiguration.offerTokens / 100);
        });

        it("Should throw an exception when a sender who already rents tries to rent", async () => {
            await this.token.leaseFrom(this.transferToAccount,
                { from: this.rentAccount, value: basicConfiguration.offerPrice})
                .should.be.rejectedWith("revert");
        });

        it("Should throw an exception when the targeted offer has already been taken", async () => {
            await this.token.leaseFrom(this.admin, 
                { from: this.transferToAccount, value: basicConfiguration.offerPrice})
                .should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender sends insufficient ether", async () => {
            await this.token.leaseFrom(this.transferToAccount,
                { from: this.spender, value: basicConfiguration.offerPrice - 1})
                .should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender tries to remove an in-progress offer", async () => {
            await this.token.removeOffer({ from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender tries to overwrite an existing offer", async () => {
            await this.token.createOffer(
                basicConfiguration.offerTokens,
                basicConfiguration.offerPrice,
                basicConfiguration.offerDuration,
                { from: this.transferToAccount }                
            ).should.be.rejectedWith("revert");
        });

    });

    describe("Terminate leasing", () => {

        it("Should throw an exception when sender tries to terminate a non-active leasing", async () => {
            await this.token.terminateLeasing({ from: this.transferToAccount })
                .should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender tries to terminate a in-progress leasing", async () => {
            await this.token.terminateLeasing({ from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be able to terminate an expired leasing", async () => {
            await increaseTime(duration.hours(3));
            const tx = await this.token.terminateLeasing({ from: this.admin }).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "LeasingTerminated", event => {
                return event.from === this.admin && event.to === this.rentAccount;
            });
        });

        it("Should be able to modify the offer instance properly", async () => {
            const leasedTo = await this.token.getOfferLeasedTo(this.admin);
            leasedTo.should.be.equal("0x0000000000000000000000000000000000000000");

            const leasedTimestamp = await this.token.getOfferLeasedTimestamp(this.admin);
            leasedTimestamp.toNumber().should.be.equal(0);

            const numberOfTokens = await this.token.getOfferNumberOfTokens(this.admin);
            numberOfTokens.toNumber().should.be.equal(basicConfiguration.offerTokens);
        });

        it("Should be able to modify the rent instance properly", async () => {
            const numberOfTokens = await this.token.getRentedNumberOfTokens(this.rentAccount);
            numberOfTokens.toNumber().should.be.equal(0);
            
            const availableTokens = await this.token.getRentedAvailableTokens(this.rentAccount);
            availableTokens.toNumber().should.be.equal(0);

            const rentedFrom = await this.token.getRentedFrom(this.rentAccount);
            rentedFrom.should.be.equal("0x0000000000000000000000000000000000000000");
        });

        it("Should be able to clear the commited tokens that came from leasing", async () => {
            const commited = await this.token.getCommitedFromRented({ from: this.rentAccount });
            commited.toNumber().should.be.equal(0);
        });

    });

});