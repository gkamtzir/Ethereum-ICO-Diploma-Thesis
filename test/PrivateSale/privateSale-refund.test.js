const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const truffleAssert = require('truffle-assertions');
const { basicConfiguration, privateSale } = require("../../config.js");
const { expect } = require('chai');
const BN = web3.utils.BN;

const { increaseTime, duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");
const { ether } = require("../helpers/ether");

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("PrivateSale -> refund tokens", accounts => {

    this.initialization = async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        
        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.tokenPrice = new BN(privateSale.tokenPrice);

        this.tokensMinCap = new BN(privateSale.tokensMinCap)

        this.tokensMaxCap = new BN(privateSale.tokensMaxCap)

        this.buyTokens = new BN(basicConfiguration.buyTokens);

        this.buyTokensInsufficient = new BN(basicConfiguration.buyTokensInsufficient);

        this.start = await latestTime();
        this.start += duration.hours(1);

        this.end = this.start + privateSale.duration;

        this.redeemableAfter = await latestTime();
        this.redeemableAfter += privateSale.redeemableAfter;
        
        this.privateSale = await PrivateSale.new(
            this.token.address,
            this.tokenPrice.toString(),
            this.tokensMinCap.toString(),
            this.tokensMaxCap.toString(),
            basicConfiguration.decimals,
            this.start,
            this.end,
            this.redeemableAfter
        );

        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];

        // Allocate the needed tokens to the Private Sale contract.
        await this.token.transfer(this.privateSale.address, this.tokensMaxCap.mul(this.power).toString(), { from: this.admin });

        // Allow 'spender' to participate in the private sale.
        await this.privateSale.allowAddress(this.spender);

        // Start the sale.
        await increaseTime(duration.hours(1));
    }

    describe("Refund (unsuccessful sale)", () => {

        before(async () => {
            await this.initialization();

            // Buy insufficient tokens.
            const cost = this.tokenPrice.mul(this.buyTokensInsufficient);
            await this.privateSale.buyTokens(this.buyTokensInsufficient.toString(),
                { from: this.spender, value: cost.toString()})
        });

        it("Should be impossible to refund tokens when the sale is in progress", async () => {       
            await this.privateSale.refundTokens({ from: this.spender })
                .should.be.rejectedWith("revert");

            // End the sale.
            await increaseTime(privateSale.duration);
        });

        it("Should be impossible to refund tokens if sender has no tokens", async () => {
            await this.privateSale.refundTokens({ from: this.admin })
                .should.be.rejectedWith("revert");
        });

        it("Should be able to refund tokens", async () => {
            const balance = await this.privateSale.getBalanceOf(this.spender);

            const tx = await this.privateSale.refundTokens({ from: this.spender })
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Refunded", event => {
                return event.from === this.spender
                    && event.numberOfTokens.eq(balance);
            });

            const newBalance = await this.privateSale.getBalanceOf(this.spender);
            expect(newBalance).to.be.bignumber.equal(new BN(0));
        });

    });

    describe("Refund (successful sale)", () => {

        before(async () => {
            await this.initialization();

            // Buy tokens.
            const cost = this.tokenPrice.mul(this.buyTokens);
            await this.privateSale.buyTokens(this.buyTokens.toString(),
                { from: this.spender, value: cost.toString()})

            // End the sale.
            await increaseTime(privateSale.duration);
        });

        it("Should be impossible to refund tokens when the sale has completed successfully", async () => {
            await this.privateSale.refundTokens({ from: this.spender })
                .should.be.rejectedWith("revert");
        });

    });

});