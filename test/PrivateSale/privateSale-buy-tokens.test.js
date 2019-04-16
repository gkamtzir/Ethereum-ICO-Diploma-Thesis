const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const truffleAssert = require('truffle-assertions');
const { basicConfiguration, privateSale } = require("../../config.js");
const { BigNumber } = require("bignumber.js");

const { increaseTime, duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");
const { ether } = require("../helpers/ether");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract("PrivateSale -> buy tokens", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        
        this.tokenPrice = new BigNumber(privateSale.tokenPrice);

        this.start = await latestTime();
        this.start += duration.hours(1);

        this.end = this.start + privateSale.duration;

        this.redeemableAfter = privateSale.redeemableAfter;
        
        this.privateSale = await PrivateSale.new(
            this.token.address,
            ether(this.tokenPrice),
            privateSale.tokensMinCap,
            privateSale.tokensMaxCap,
            this.start,
            this.end,
            this.redeemableAfter
        );

        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];

        // Allocate the needed tokens to the Private Sale contract.
        await this.token.transfer(this.privateSale.address, privateSale.totalSupply, { from: this.admin });

        // Start the sale.
        await increaseTime(duration.hours(1));
    });

    describe("Buy tokens", () => {

        it("Should be impossible to buy more tokens than available", async() => {
            const cost = this.tokenPrice.times(privateSale.totalSupply + 1);
            await this.privateSale.buyTokens(privateSale.totalSupply + 1,
                { from: this.spender, value: ether(cost)})
                .should.be.rejectedWith("revert");
        });

        it("Should be impossible to buy tokens when sending less ether than required", async () => {
            const cost = this.tokenPrice.times(basicConfiguration.buyTokens - 1);
            await this.privateSale.buyTokens(basicConfiguration.buyTokens,
                { from: this.spender, value: ether(cost)})
                .should.be.rejectedWith("revert");
        });

        it("Should be able to buy tokens", async () => {       
            const cost = this.tokenPrice.times(basicConfiguration.buyTokens);
            const tx = await this.privateSale.buyTokens(basicConfiguration.buyTokens,
                { from: this.spender, value: ether(cost)})
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Sold", event => {
                return event.from === this.spender
                    && event.numberOfTokens.toNumber() === basicConfiguration.buyTokens;
            });

            const tokensSold = await this.privateSale.getTokensSold();
            tokensSold.toNumber().should.be.equal(basicConfiguration.buyTokens);

            const balance = await this.privateSale.getBalanceOf(this.spender);
            balance.toNumber().should.be.equal(basicConfiguration.buyTokens);
        });

    });

});