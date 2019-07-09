const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const { basicConfiguration, privateSale } = require("../../config.js");
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const BN = web3.utils.BN;

const { duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("PrivateSale -> status", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        
        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.tokenPrice = new BN(privateSale.tokenPrice);

        this.tokensMinCap = new BN(privateSale.tokensMinCap)

        this.tokensMaxCap = new BN(privateSale.tokensMaxCap)

        this.buyTokens = new BN(basicConfiguration.buyTokens);

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
    });

    describe("Status", () => {

        it("Should be activated initially", async () => {
            const status = await this.privateSale.getStatus();
            expect(status).to.be.bignumber.equal(new BN(basicConfiguration.status.activated));
        });

        it("Should throw an exception when a non-admin address tries to deactivate the contract", async () => {
            await this.privateSale.deactivate({ from: this.spender }).should.be.rejectedWith("revert");
        });

        it("Should be able to deactivated by the owner", async () => {
            const tx = await this.privateSale.deactivate({ from: this.admin }).should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "Deactivated", event => {
                return true;
            });
        });

        it("Should be impossible to use the buyTokens function when contract is deactivated", async () => {
            const cost = this.tokenPrice.mul(this.buyTokens);
            await this.privateSale.buyTokens(this.buyTokens.toString(), { from: this.admin, value: cost.toString() })
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

        it("Should be activated by admin", async () => {
            const tx = await this.privateSale.activate({ from: this.admin }).should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "Activated", event => {
                return true;
            });
        });

    });

});