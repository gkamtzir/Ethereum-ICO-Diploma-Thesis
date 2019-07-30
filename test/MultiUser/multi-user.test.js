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

contract("Multi-User -> Buy tokens", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        
        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.tokenPrice = new BN(privateSale.tokenPrice);

        this.tokensMinCap = new BN(100);

        this.tokensMaxCap = new BN(privateSale.tokensMaxCap);

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

        // Allocate the needed tokens to the Sale contract.
        await this.token.transfer(this.privateSale.address, this.tokensMaxCap.mul(this.power).toString(), { from: this.admin });

        // Allow all 10 addresses to participate in the sale.
        for (let i = 1; i < accounts.length; i++) {
            await this.privateSale.allowAddress(accounts[i]);
        }

        // Start the sale.
        await increaseTime(duration.hours(1) + 1);
    });

    describe("(Multi-user) Buy tokens", () => {

        it("(Multi-user) Should be able to buy tokens", async () => {    
            let cost = 0;
            let tokens = 0;

            for (let j = 0; j < 27; j++) {
                for (let i = 1; i < accounts.length; i++) {
                    tokens = 2500 + Math.floor(Math.random() * 1000);
                    tokens = new BN(tokens.toString());
                    cost = this.tokenPrice.mul(tokens);

                    this.privateSale.buyTokens(tokens.toString(),
                        { from: accounts[i], value: cost.toString()}).should.be.fulfilled;
                }
                await increaseTime(duration.days(1));
            }

            let tokensSold = await this.privateSale.getTokensSold();
            console.log("Tokens sold: " + tokensSold.toString());
        });

    });

});