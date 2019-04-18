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

contract("PrivateSale -> redeem tokens", accounts => {

    this.initialization = async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
            
        this.tokenPrice = new BigNumber(privateSale.tokenPrice);

        this.start = await latestTime();
        this.start += duration.hours(1);

        this.end = this.start + privateSale.duration;

        this.redeemableAfter = await latestTime();
        this.redeemableAfter += privateSale.redeemableAfter;
        
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
        await this.token.transfer(this.privateSale.address, privateSale.tokensMaxCap, { from: this.admin });

        // Allow 'spender' to participate in the private sale.
        await this.privateSale.allowAddress(this.spender);

        // Start the sale.
        await increaseTime(duration.hours(1));
    }

    describe("Redeem (successful sale)", () => {

        before(async () => {
            await this.initialization();

            // Buy tokens.
            const cost = this.tokenPrice.times(basicConfiguration.buyTokens);
            await this.privateSale.buyTokens(basicConfiguration.buyTokens,
                { from: this.spender, value: ether(cost)});
        });

        it("Should be impossible to redeem tokens when the sale is in progress", async () => {       
            await this.privateSale.redeemTokens({ from: this.spender })
                .should.be.rejectedWith("revert");

            // End the sale.
            await increaseTime(privateSale.duration);
        });

        it("Should be impossible to redeem tokens when sender hasn't bought any during the sale", async () => {
            await this.privateSale.redeemTokens({ from: this.admin })
                .should.be.rejectedWith("revert");
        });

        it("Should be impossible to redeem tokens when tokens are not redeemable yet", async () => {
            await this.privateSale.redeemTokens({ from: this.spender })
                .should.be.rejectedWith("revert");

            // Make tokens redeemable.
            await increaseTime(this.redeemableAfter);
        });

        it("Should be able to redeem the tokens", async () => {
            let balance = await this.privateSale.getBalanceOf(this.spender);
            
            const tx = await this.privateSale.redeemTokens({ from: this.spender })
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Redeemed", event => {
                return event.from === this.spender
                    && event.numberOfTokens.toNumber() === balance.toNumber();
            });

            // Sender's sale balance should be zero.
            balance = await this.privateSale.getBalanceOf(this.spender);
            balance.toNumber().should.be.equal(0);

            // Sender's token balance should be non-zero.
            balance = await this.token.balanceOf(this.spender);
            balance.toNumber().should.be.equal(basicConfiguration.buyTokens);

            // Private Sale's token balance should decrease.
            balance = await this.token.balanceOf(this.privateSale.address);
            balance.toNumber().should.be.equal(privateSale.tokensMaxCap - basicConfiguration.buyTokens);
        });

    });

    describe("Redeem (unsuccessful sale)", () => {

        before(async () => {
            await this.initialization();

            // Buy tokens.
            const cost = this.tokenPrice.times(basicConfiguration.buyTokensInsufficient);
            await this.privateSale.buyTokens(basicConfiguration.buyTokensInsufficient,
                { from: this.spender, value: ether(cost)});

            // End the sale.
            await increaseTime(privateSale.duration);
        });

        it("Should be impossible to redeem tokens when the sale has failed", async () => {       
            await this.privateSale.redeemTokens({ from: this.spender })
                .should.be.rejectedWith("revert");
        });

    });

});