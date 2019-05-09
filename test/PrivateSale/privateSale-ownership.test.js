const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const truffleAssert = require('truffle-assertions');
const { basicConfiguration, privateSale } = require("../../config.js");
const { BigNumber } = require("bignumber.js");

const { duration } = require("../helpers/increaseTime");
const { latestTime } = require("../helpers/latestTime");
const { ether } = require("../helpers/ether");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract("PrivateSale -> ownership", accounts => {

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
        this.transferTo = accounts[basicConfiguration.transferToAccount];
    });

    describe("Ownership", () => {

        it("Should be impossible for a non-admin account to transfer contract's ownership", async () => {
            await this.privateSale.transferOwnership(this.transferTo,
                { from: this.spender}).should.be.rejectedWith("revert");
        });

        it("Should be able to transfered contract's ownership by the owner", async () => {
            const owner = await this.privateSale.getOwner();
            owner.should.be.equal(this.admin);

            const tx = await this.privateSale.transferOwnership(this.transferTo,
                { from: this.admin }).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "OwnershipTransfered", event => {
                return event.from === this.admin
                    && event.to === this.transferTo
            });

            const newOwner = await this.privateSale.getOwner();
            newOwner.should.be.equal(this.transferTo);
        });

    });

});