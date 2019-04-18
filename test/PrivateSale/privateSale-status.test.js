const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const { basicConfiguration, privateSale } = require("../../config.js");
const { BigNumber } = require("bignumber.js");

const { duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");
const { ether } = require("../helpers/ether");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract("PrivateSale -> status", accounts => {

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
    });

    describe("Status", () => {

        it("Should be activated initially", async () => {
            const status = await this.privateSale.getStatus();
            status.toNumber().should.be.equal(basicConfiguration.status.activated);
        });

        it("Should throw an exception when a non-admin address tries to deactivate the contract", async () => {
            await this.privateSale.deactivate({ from: this.spender }).should.be.rejectedWith("revert");
        });

        it("Should be able to deactivated by the owner", async () => {
            await this.privateSale.deactivate({ from: this.admin }).should.be.fulfilled;
        });

        it("Should be impossible to use the buyTokens function when contract is deactivated", async () => {
            await this.privateSale.buyTokens(basicConfiguration.buyTokens, { from: this.admin })
                .should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the refundTokens function when contract is deactivated", async () => {
            await this.privateSale.refundTokens({ from: this.admin })
                .should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the redeemTokens function when contract is deactivated", async () => {
            await this.privateSale.redeemTokens({ from: this.admin })
                .should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the allowAddress function when contract is deactivated", async () => {
            await this.privateSale.allowAddress(this.spender, { from: this.admin })
                .should.be.rejectedWith("revert");
        });

    });

});