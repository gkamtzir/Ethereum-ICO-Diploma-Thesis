const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const truffleAssert = require('truffle-assertions');
const { basicConfiguration, privateSale } = require("../../config.js");
const { expect } = require('chai');
const BN = web3.utils.BN;

const { duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("PrivateSale -> ownership", accounts => {

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
        this.spender = accounts[basicConfiguration.spenderAccount];
        this.transferTo = accounts[basicConfiguration.transferToAccount];
    });

    describe("Ownership", () => {

        it("Should be impossible for a non-admin account to transfer contract's ownership", async () => {
            await this.privateSale.transferOwnership(this.transferTo,
                { from: this.spender}).should.be.rejectedWith("revert");
        });

        it("Should be able to transfered contract's ownership by the owner", async () => {
            const owner = await this.privateSale.getOwner();
            expect(owner).to.be.equal(this.admin);

            const tx = await this.privateSale.transferOwnership(this.transferTo,
                { from: this.admin }).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "OwnershipTransfered", event => {
                return event.from === this.admin
                    && event.to === this.transferTo
            });

            const newOwner = await this.privateSale.getOwner();
            expect(newOwner).to.be.equal(this.transferTo);
        });

    });

});