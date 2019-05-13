const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const truffleAssert = require("truffle-assertions");
const { expect } = require('chai');
const BN = web3.utils.BN;

const { increaseTime, duration } = require("../helpers/increaseTime");

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("OpenHouseToken -> lease", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];
        this.rentAccount = accounts[basicConfiguration.rentAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];

        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.totalSupply = new BN(basicConfiguration.totalSupply);
        this.totalSupply = this.totalSupply.mul(this.power);

        this.offerTokens = new BN(basicConfiguration.offerTokens);
        this.offerTokens = this.offerTokens.mul(this.power);

        this.offerPrice = new BN(basicConfiguration.offerPrice);

        await this.token.createOffer(
            this.offerTokens.toString(),
            this.offerPrice.toString(),
            basicConfiguration.offerDuration,
            { from: this.admin }
        );

        await this.token.transfer(this.transferToAccount, this.offerTokens.div(new BN(10)).toString(), 
            { from: this.admin });

        await this.token.createOffer(
            this.offerTokens.div(new BN(10)).toString(),
            this.offerPrice.toString(),
            basicConfiguration.offerDuration,
            { from: this.transferToAccount }
        );
    });

    describe("Lease", () => {

        it("Should be able to lease", async () => {
            const tx = await this.token.leaseFrom(this.admin, 
                { from: this.rentAccount, value: this.offerPrice.toString()})
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Leased", event => {
                return event.from === this.admin && event.to === this.rentAccount;
            });

            const block = await web3.eth.getBlock(tx.receipt.logs[0].blockNumber);
            this.timestamp = block.timestamp;
        });

        it("Should be able to create the rent instance properly", async () => {
            const numberOfTokens = await this.token.getRentedNumberOfTokens(this.rentAccount);
            expect(numberOfTokens).to.be.bignumber.equal(this.offerTokens);

            const availableTokens = await this.token.getRentedAvailableTokens(this.rentAccount);
            expect(availableTokens).to.be.bignumber.equal(this.offerTokens);

            const rentedFrom = await this.token.getRentedFrom(this.rentAccount);
            expect(rentedFrom).to.be.equal(this.admin);
        });

        it("Should be able to modify the offer instance properly", async () => {
            const leasedTo = await this.token.getOfferLeasedTo(this.admin);
            expect(leasedTo).to.be.equal(this.rentAccount);

            const leasedTimestamp = await this.token.getOfferLeasedTimestamp(this.admin);
            expect(leasedTimestamp).to.be.bignumber.equal(new BN(this.timestamp));

            // Commits some of the rented tokens.
            await this.token.commitFromRented(this.offerTokens.div(new BN(100)).toString(), { from: this.rentAccount });

            const commited = await this.token.getCommitedFromRented({ from: this.rentAccount });
            expect(commited).to.be.bignumber.equal(this.offerTokens.div(new BN(100)));
        });

        it("Should throw an exception when a sender who already rents tries to rent", async () => {
            await this.token.leaseFrom(this.transferToAccount,
                { from: this.rentAccount, value: this.offerPrice.toString()})
                .should.be.rejectedWith("revert");
        });

        it("Should throw an exception when the targeted offer has already been taken", async () => {
            await this.token.leaseFrom(this.admin, 
                { from: this.transferToAccount, value: this.offerPrice.toString()})
                .should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender sends insufficient ether", async () => {
            await this.token.leaseFrom(this.transferToAccount,
                { from: this.spender, value: this.offerPrice.sub(new BN(1))})
                .should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender tries to remove an in-progress offer", async () => {
            await this.token.removeOffer({ from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender tries to overwrite an existing offer", async () => {
            await this.token.createOffer(
                this.offerTokens.toString(),
                this.offerPrice.toString(),
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
            expect(leasedTo).to.be.equal("0x0000000000000000000000000000000000000000");

            const leasedTimestamp = await this.token.getOfferLeasedTimestamp(this.admin);
            expect(leasedTimestamp).to.be.bignumber.equal(new BN(0));

            const numberOfTokens = await this.token.getOfferNumberOfTokens(this.admin);
            expect(numberOfTokens).to.be.bignumber.equal(this.offerTokens);
        });

        it("Should be able to modify the rent instance properly", async () => {
            const numberOfTokens = await this.token.getRentedNumberOfTokens(this.rentAccount);
            expect(numberOfTokens).to.be.bignumber.equal(new BN(0));
            
            const availableTokens = await this.token.getRentedAvailableTokens(this.rentAccount);
            expect(availableTokens).to.be.bignumber.equal(new BN(0));

            const rentedFrom = await this.token.getRentedFrom(this.rentAccount);
            expect(rentedFrom).to.be.equal("0x0000000000000000000000000000000000000000");
        });

        it("Should be able to clear the commited tokens that came from leasing", async () => {
            const commited = await this.token.getCommitedFromRented({ from: this.rentAccount });
            expect(commited).to.be.bignumber.equal(new BN(0));
        });

    });

});