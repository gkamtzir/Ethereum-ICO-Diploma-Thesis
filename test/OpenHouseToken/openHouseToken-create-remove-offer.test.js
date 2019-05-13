const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const BN = web3.utils.BN;

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("OpenHouseToken -> create/remove offer", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.commitAccount = accounts[basicConfiguration.commitAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];

        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.offerTokens = new BN(basicConfiguration.offerTokens);
        this.offerTokens = this.offerTokens.mul(this.power);

        this.totalSupply = new BN(basicConfiguration.totalSupply);
        this.totalSupply = this.totalSupply.mul(this.power);

        this.offerPrice = new BN(basicConfiguration.offerPrice);
    });

    describe("Create offers", () => {

        it("Should throw an exception when sender has insufficient tokens for leasing", async () => {
            await this.token.createOffer(
                this.totalSupply.mul(new BN(2)).toString(),
                this.offerPrice.toString(),
                basicConfiguration.offerDuration,
                { from: this.admin }
            ).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender sets the number of tokens to be leased to zero", async () => {
            await this.token.createOffer(
                0,
                this.offerPrice.toString(),
                basicConfiguration.offerDuration,
                { from: this.admin}
            ).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender sets the price to zero", async () => {
            await this.token.createOffer(
                this.offerTokens.toString(),
                0,
                basicConfiguration.offerDuration,
                { from: this.admin }                
            ).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender sets the duration less than an hour", async () => {
            await this.token.createOffer(
                this.offerTokens.toString(),
                this.offerPrice.toString(),
                3500,
                { from: this.admin } 
            ).should.be.rejectedWith("revert");
        });

        it("Should be able to create offers", async () => {
            const tx = await this.token.createOffer(
                this.offerTokens.toString(),
                this.offerPrice.toString(),
                basicConfiguration.offerDuration,
                { from: this.admin }                
            ).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "OfferCreated", event => {
                return event.from === this.admin
                    && event.numberOfTokens.eq(this.offerTokens)
                    && event.price.eq(this.offerPrice)
                    && event.duration.eq(new BN(basicConfiguration.offerDuration));
            });
        });

        it("Should decrease the sender's balance accordingly", async () => {
            const balance = await this.token.balanceOf(this.admin);
            expect(balance).to.be.bignumber.equal(this.totalSupply.sub(this.offerTokens));
        });

        it("Should be able to populate the offer instance properly", async() => {
            const offerTokens = await this.token.getOfferNumberOfTokens(this.admin);
            expect(offerTokens).to.be.bignumber.equal(this.offerTokens);

            const offerPrice = await this.token.getOfferPrice(this.admin);
            expect(offerPrice).to.be.bignumber.equal(this.offerPrice);

            const offerDuration = await this.token.getOfferDuration(this.admin);
            expect(offerDuration).to.be.bignumber.equal(new BN(basicConfiguration.offerDuration));

            const offerLeasedTo = await this.token.getOfferLeasedTo(this.admin);
            expect(offerLeasedTo).to.be.equal("0x0000000000000000000000000000000000000000");

            const offerLeasedTimestamp = await this.token.getOfferLeasedTimestamp(this.admin);
            expect(offerLeasedTimestamp).to.be.bignumber.equal(new BN(0));
        });

    });

    describe("Remove offers", () => {

        it("Should be able to remove the offer", async () => {
            const tx = await this.token.removeOffer({ from: this.admin }).should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "OfferRemoved", event => {
                return event.from === this.admin;
            });
        });

        it("Should be able to remove the offer instance properly", async () => {
            const offerTokens = await this.token.getOfferNumberOfTokens(this.admin);
            expect(offerTokens).to.be.bignumber.equal(new BN(0));

            const offerPrice = await this.token.getOfferPrice(this.admin);
            expect(offerPrice).to.be.bignumber.equal(new BN(0));

            const offerDuration = await this.token.getOfferDuration(this.admin);
            expect(offerDuration).to.be.bignumber.equal(new BN(0));
        });

    });

});