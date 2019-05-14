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

contract("PrivateSale -> buy tokens", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        
        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.tokenPrice = new BN(privateSale.tokenPrice);

        this.tokensMinCap = new BN(privateSale.tokensMinCap)
        this.tokensMinCap = this.tokensMinCap.mul(this.power);

        this.tokensMaxCap = new BN(privateSale.tokensMaxCap)
        this.tokensMaxCap = this.tokensMaxCap.mul(this.power);

        this.buyTokens = new BN(basicConfiguration.buyTokens);

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

        // Allocate the needed tokens to the Private Sale contract.
        await this.token.transfer(this.privateSale.address, this.tokensMaxCap.toString(), { from: this.admin });

        // Allow 'spender' to participate in the private sale.
        await this.privateSale.allowAddress(this.spender);

        // Start the sale.
        await increaseTime(duration.hours(1));
    });

    describe("Buy tokens", () => {

        it("Should be impossible to buy more tokens than available", async() => {
            const cost = this.tokenPrice.mul(this.tokensMaxCap.div(this.power).add(new BN(1)));
            await this.privateSale.buyTokens(this.tokensMaxCap.div(this.power).add(new BN(1)).toString(),
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
                    && event.numberOfTokens.eq(this.buyTokens.mul(this.power));
            });

            const tokensSold = await this.privateSale.getTokensSold();
            expect(tokensSold).to.be.bignumber.equal(this.buyTokens.mul(this.power));

            const balance = await this.privateSale.getBalanceOf(this.spender);
            expect(balance).to.be.bignumber.equal(this.buyTokens.mul(this.power));
        });

    });

});