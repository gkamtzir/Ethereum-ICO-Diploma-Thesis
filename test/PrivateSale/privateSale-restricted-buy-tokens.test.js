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

contract("PrivateSale -> buy tokens (restricted)", accounts => {

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

        // Start the sale.
        await increaseTime(duration.hours(1) + 1);
    });

    describe("Buy tokens (restricted)", () => {

        it("Should be impossible to buy tokens when sender is not allowed", async () => {
            const allowed = await this.privateSale.getAddressAllowance(this.spender);
            expect(allowed).to.be.false; 

            const cost = this.tokenPrice.mul(this.buyTokens);
            await this.privateSale.buyTokens(this.buyTokens.toString(),
                { from: this.spender, value: cost.toString()})
                .should.be.rejectedWith("revert");
        });

        it("Should be able to allow a given address to participate to the private sale", async () => {
            const tx = await this.privateSale.allowAddress(this.spender).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "AddressAllowed", event => {
                return event.allowed === this.spender;
            });

           const allowed = await this.privateSale.getAddressAllowance(this.spender);
           expect(allowed).to.be.true;
        });

        it("Should be able to buy tokens when sender is allowed", async () => {
            const cost = this.tokenPrice.mul(this.buyTokens);
            const tx = await this.privateSale.buyTokens(this.buyTokens.toString(),
                { from: this.spender, value: cost.toString()})
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Sold", event => {
                return event.from === this.spender
                    && event.numberOfTokens.eq(this.buyTokens);
            });
        });

    });

});