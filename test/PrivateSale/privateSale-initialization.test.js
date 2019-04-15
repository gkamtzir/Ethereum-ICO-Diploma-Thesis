const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const { basicConfiguration, privateSale } = require("../../config.js");
const BigNumber = web3.BigNumber;

const { duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract("PrivateSale -> initialize", accounts => {

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

        // Allocate the needed tokens to the Private Sale contract.
        await this.token.transfer(this.privateSale.address, privateSale.totalSupply, { from: this.admin });
    });

    describe("Initialization", () => {

        it("Should initialize private sale with the correct owner", async () => {
            const owner = await this.privateSale.getOwner();
            owner.should.be.equal(this.admin);
        });

        it("Should initialize private sale with the correct price", async () => {
            const price = await this.privateSale.getTokenPrice();
            price.toNumber().should.be.equal(privateSale.tokenPrice);
        });

        it("Should initialize the private sale with the correct total supply", async () => {
            const totalSupply = await this.token.balanceOf(this.privateSale.address);
            totalSupply.toNumber().should.be.equal(privateSale.totalSupply);
        });

        it("Should initialize private sale with the correct minimum cap", async () => {
            const minCap = await this.privateSale.getTokensMinCap();
            minCap.toNumber().should.be.equal(privateSale.tokensMinCap);
        });

        it("Should initialize private sale with the correct maximum cap", async () => {
            const maxCap = await this.privateSale.getTokensMaxCap();
            maxCap.toNumber().should.be.equal(privateSale.tokensMaxCap);
        });

        it("Should initialize private sale with the zero sold tokens", async () => {
            const soldTokens = await this.privateSale.getTokensSold();
            soldTokens.toNumber().should.be.equal(0);
        });

        it("Should initialize private sale with the correct start date", async () => {
            const start = await this.privateSale.getStartTimestamp();
            start.toNumber().should.be.equal(this.start);
        });

        it("Should initialize private sale with the correct end date", async () => {
            const end = await this.privateSale.getEndTimestamp();
            end.toNumber().should.be.equal(this.end);
        });

        it("Should initialize the private sale with the correct redeemableAfter timestamp", async () => {
            const redeemableAfter = await this.privateSale.getRedeemableAfterTimestamp();
            redeemableAfter.toNumber().should.be.equal(this.redeemableAfter);
        });

    });

});