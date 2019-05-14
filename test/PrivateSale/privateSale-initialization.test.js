const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const { basicConfiguration, privateSale } = require("../../config.js");
const { expect } = require('chai');
const BN = web3.utils.BN;

const { duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");
const { ether } = require("../helpers/ether");

require('chai')
    .use(require("chai-bn")(BN))
    .should();

contract("PrivateSale -> initialize", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        
        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.tokenPrice = new BN(privateSale.tokenPrice);

        this.tokensMinCap = new BN(privateSale.tokensMinCap)

        this.tokensMaxCap = new BN(privateSale.tokensMaxCap)

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

        // Allocate the needed tokens to the Private Sale contract.
        await this.token.transfer(this.privateSale.address, this.tokensMaxCap.mul(this.power).toString(), { from: this.admin });
    });

    describe("Initialization", () => {

        it("Should initialize private sale with the correct owner", async () => {
            const owner = await this.privateSale.getOwner();
            expect(owner).to.be.equal(this.admin);
        });

        it("Should initialize private sale with the correct price", async () => {
            const price = await this.privateSale.getTokenPrice();
            expect(price).to.be.bignumber.equal(this.tokenPrice);
        });

        it("Should initialize the private sale with the correct total supply", async () => {
            const totalSupply = await this.token.balanceOf(this.privateSale.address);
            expect(totalSupply).to.be.bignumber.equal(this.tokensMaxCap.mul(this.power));
        });

        it("Should initialize private sale with the correct minimum cap", async () => {
            const minCap = await this.privateSale.getTokensMinCap();
            expect(minCap).to.be.bignumber.equal(this.tokensMinCap);
        });

        it("Should initialize private sale with the correct maximum cap", async () => {
            const maxCap = await this.privateSale.getTokensMaxCap();
            expect(maxCap).to.be.bignumber.equal(this.tokensMaxCap);
        });

        it("Should initialize private sale with the zero sold tokens", async () => {
            const soldTokens = await this.privateSale.getTokensSold();
            expect(soldTokens).to.be.bignumber.equal(new BN(0));
        });

        it("Should initialize private sale with the correct start date", async () => {
            const start = await this.privateSale.getStartTimestamp();
            expect(start).to.be.bignumber.equal(new BN(this.start));
        });

        it("Should initialize private sale with the correct end date", async () => {
            const end = await this.privateSale.getEndTimestamp();
            expect(end).to.be.bignumber.equal(new BN(this.end));
        });

        it("Should initialize the private sale with the correct redeemableAfter timestamp", async () => {
            const redeemableAfter = await this.privateSale.getRedeemableAfterTimestamp();
            expect(redeemableAfter).to.be.bignumber.equal(new BN(this.redeemableAfter));
        });

    });

});