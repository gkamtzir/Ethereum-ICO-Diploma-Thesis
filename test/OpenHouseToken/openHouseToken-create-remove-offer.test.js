
const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const truffleAssert = require('truffle-assertions');
const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract("OpenHouseToken -> create/remove offer", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.commitAccount = accounts[basicConfiguration.commitAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];
    });

    describe("Create offers", () => {

        it("Should throw an exception when sender has insufficient tokens for leasing", async () => {
            await this.token.createOffer(
                2 * basicConfiguration.totalSupply,
                basicConfiguration.offerPrice,
                basicConfiguration.offerDuration,
                { from: this.admin }
            ).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender sets the number of tokens to be leased to zero", async () => {
            await this.token.createOffer(
                0,
                basicConfiguration.offerPrice,
                basicConfiguration.offerDuration,
                { from: this.admin}
            ).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender sets the price to zero", async () => {
            await this.token.createOffer(
                basicConfiguration.offerTokens,
                0,
                basicConfiguration.offerDuration,
                { from: this.admin }                
            ).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender sets the duration less than an hour", async () => {
            await this.token.createOffer(
                basicConfiguration.offerTokens,
                basicConfiguration.offerPrice,
                3500,
                { from: this.admin } 
            ).should.be.rejectedWith("revert");
        });

        it("Should be able to create offers", async () => {
            const tx = await this.token.createOffer(
                basicConfiguration.offerTokens,
                basicConfiguration.offerPrice,
                basicConfiguration.offerDuration,
                { from: this.admin }                
            ).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "OfferCreated", event => {
                return event.from === this.admin
                    && event.numberOfTokens.toNumber() === basicConfiguration.offerTokens
                    && event.price.toNumber() === basicConfiguration.offerPrice
                    && event.duration.toNumber() === basicConfiguration.offerDuration;
            });
        });

        it("Should decrease the sender's balance accordingly", async () => {
            const balance = await this.token.balanceOf(this.admin);
            balance.toNumber().should.be.equal(basicConfiguration.totalSupply - basicConfiguration.offerTokens);
        });

        it("Should be able to populate the offer instance properly", async() => {
            const offerTokens = await this.token.getOfferNumberOfTokens(this.admin);
            offerTokens.toNumber().should.be.equal(basicConfiguration.offerTokens);

            const offerPrice = await this.token.getOfferPrice(this.admin);
            offerPrice.toNumber().should.be.equal(basicConfiguration.offerPrice);

            const offerDuration = await this.token.getOfferDuration(this.admin);
            offerDuration.toNumber().should.be.equal(basicConfiguration.offerDuration);

            const offerLeasedTo = await this.token.getOfferLeasedTo(this.admin);
            offerLeasedTo.should.be.equal("0x0000000000000000000000000000000000000000");

            const offerLeasedTimestamp = await this.token.getOfferLeasedTimestamp(this.admin);
            offerLeasedTimestamp.toNumber().should.be.equal(0);
        });

        it("Should be able to remove the offer", async () => {
            const tx = await this.token.removeOffer({ from: this.admin }).should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "OfferRemoved", event => {
                return event.from === this.admin;
            });
        });

        it("Should be able to remove the offer instance properly", async () => {
            const offerTokens = await this.token.getOfferNumberOfTokens(this.admin);
            offerTokens.toNumber().should.be.equal(0);

            const offerPrice = await this.token.getOfferPrice(this.admin);
            offerPrice.toNumber().should.be.equal(0);

            const offerDuration = await this.token.getOfferDuration(this.admin);
            offerDuration.toNumber().should.be.equal(0);
        });

    });

});