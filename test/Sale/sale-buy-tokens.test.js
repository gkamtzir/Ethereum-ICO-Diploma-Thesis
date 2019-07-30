const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const truffleAssert = require('truffle-assertions');
const { basicConfiguration, privateSale } = require("../../config.js");
const { expect } = require('chai');
const BN = web3.utils.BN;

const { increaseTime, duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("Sale -> buy tokens", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        
        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.tokenPrice = new BN(privateSale.tokenPrice);

        // This is just to test that is not capable for someone to
        // buy tokens that does not exist.
        this.tokensMinCap = new BN('10000');

        this.tokensMaxCap = new BN('20000');

        this.buyTokens = new BN('10000');

        this.start = await latestTime();
        this.start += duration.hours(1);

        this.end = this.start + privateSale.duration;

        this.redeemableAfter = await latestTime();
        this.redeemableAfter += privateSale.redeemableAfter;
        
        this.privateSale = await PrivateSale.new(
            this.token.address,
            this.tokenPrice,
            this.tokensMinCap.toString(),
            this.tokensMaxCap.toString(),
            basicConfiguration.decimals,
            this.start,
            this.end,
            this.redeemableAfter
        );

        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];

        // Allocate the needed tokens to the Sale contract.
        await this.token.transfer(this.privateSale.address, this.tokensMaxCap.mul(this.power).toString(), { from: this.admin });

        // Allow 'spender' to participate in the sale.
        await this.privateSale.allowAddress(this.spender);

        // Start the sale.
        await increaseTime(duration.hours(1) + 1);
    });

    describe("Buy tokens", () => {

        it("Should be impossible to buy more tokens than available", async() => {
            const cost = this.tokenPrice.mul(this.tokensMaxCap.add(new BN(1)));
            await this.privateSale.buyTokens(this.tokensMaxCap.add(new BN(1)).toString(),
                { from: this.spender, value: cost.toString()})
                .should.be.rejectedWith("revert");
        });

        it("Should be impossible to buy tokens when sending less ether than required", async () => {
            const cost = this.tokenPrice.mul(this.buyTokens.sub(new BN(1)));
            await this.privateSale.buyTokens(this.buyTokens.toString(),
                { from: this.spender, value: cost.toString()})
                .should.be.rejectedWith("revert");
        });

        it("Should be able to buy tokens", async () => {       
            const cost = this.tokenPrice.mul(this.buyTokens);
            const tx = await this.privateSale.buyTokens(this.buyTokens.toString(),
                { from: this.spender, value: cost.toString()})
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Sold", event => {
                return event.from === this.spender
                    && event.numberOfTokens.eq(this.buyTokens);
            });

            const tokensSold = await this.privateSale.getTokensSold();
            expect(tokensSold).to.be.bignumber.equal(this.buyTokens);

            const balance = await this.privateSale.getBalanceOf(this.spender);
            expect(balance).to.be.bignumber.equal(this.buyTokens);
        });

    });

});