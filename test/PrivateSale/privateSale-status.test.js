const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const { basicConfiguration, privateSale } = require("../../config.js");
const BigNumber = web3.BigNumber;

const { duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract("PrivateSale -> status", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        
        this.start = await latestTime();
        this.start += duration.hours(1);

        this.end = this.start + privateSale.duration;

        this.redeemableAfter = privateSale.redeemableAfter;
        
        this.privateSale = await PrivateSale.new(
            this.token.address,
            privateSale.tokenPrice,
            privateSale.tokensMinCap,
            privateSale.tokensMaxCap,
            this.start,
            this.end,
            this.redeemableAfter
        );

        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];
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

    });

});