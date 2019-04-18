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

contract("PrivateSale -> buy tokens (restricted)", accounts => {

    before(async () => {
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

        // Start the sale.
        await increaseTime(duration.hours(1));
    });

    describe("Buy tokens (restricted)", () => {

        it("Should be impossible to buy tokens when sender is not allowed", async () => {
            const allowed = await this.privateSale.getAddressAllowance(this.spender);
            allowed.should.be.equal(false); 

            const cost = this.tokenPrice.times(basicConfiguration.buyTokens);
            await this.privateSale.buyTokens(basicConfiguration.buyTokens,
                { from: this.spender, value: ether(cost)})
                .should.be.rejectedWith("revert");
        });

        it("Should be able to allow a given address to participate to the private sale", async () => {
           await this.privateSale.allowAddress(this.spender).should.be.fulfilled;

           const allowed = await this.privateSale.getAddressAllowance(this.spender);
           allowed.should.be.equal(true);
        });

        it("Should be able to buy tokens when sender is allowed", async () => {
            const cost = this.tokenPrice.times(basicConfiguration.buyTokens);
            const tx = await this.privateSale.buyTokens(basicConfiguration.buyTokens,
                { from: this.spender, value: ether(cost)})
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Sold", event => {
            return event.from === this.spender
                && event.numberOfTokens.toNumber() === basicConfiguration.buyTokens;
            });
        });

    });

});