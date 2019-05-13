const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const BN = web3.utils.BN;

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("OpenHouseToken -> status", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];

        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.approvedTokens = new BN(basicConfiguration.approvedTokens);
        this.approvedTokens = this.approvedTokens.mul(this.power);

        this.transferedTokens = new BN(basicConfiguration.transferedTokens);
        this.transferedTokens = this.transferedTokens.mul(this.power);

        this.offerTokens = new BN(basicConfiguration.offerTokens);
        this.offerTokens = this.offerTokens.mul(this.power);

        this.offerPrice = new BN(basicConfiguration.offerPrice);
    });

    describe("Status", () => {

        it("Should be activated initially", async () => {
            const status = await this.token.getStatus();
            expect(status).to.be.bignumber.equal(new BN(basicConfiguration.status.activated));
        });

        it("Should not be possible to deactivate it a non-admin address", async () => {
            await this.token.deactivate({ from: this.spender }).should.be.rejectedWith("revert");
        });

        it("Should be deactivated by admin", async () => {
            const tx = await this.token.deactivate({ from: this.admin }).should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "Deactivated", event => {
                return true;
            });
        });

        it("Should be impossible to use the approve function when contract is deactivated", async () => {
            await this.token.approve(this.spender, this.approvedTokens.toString(), 
                { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the transfer function when contract is deactivated", async () => {
            await this.token.transfer(this.spender, this.transferedTokens.toString(), 
                { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the transferFrom function when contract is deactivated", async () => {
            await this.token.transferFrom(this.admin, this.transferToAccount, 
                this.transferedTokens, { from: this.spender }).should.be.rejectedWith("revert");
        });

        it("Should be impossible for a non-admin address to activate the contract", async () => {
            await this.token.activate({ from: this.spender }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the commitToBalance function when contract is deactivated", async () => {
            await this.token.commitToBalance(0, { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the commitFromBalance function when contract is deactivated", async () => {
            await this.token.commitFromBalance(0, { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the commitToRented function when contract is deactivated", async () => {
            await this.token.commitToRented(0, { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the commitFromRented function when contract is deactivated", async () => {
            await this.token.commitFromRented(0, { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the createOffer function when contract is deactivated", async () => {
            await this.token.createOffer(
                this.offerTokens.toString(),
                this.offerPrice.toString(),
                basicConfiguration.offerDuration,
                { from: this.admin }
            ).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the removeOffer function when contract is deactivated", async () => {
            await this.token.removeOffer({ from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the leaseFrom function when contract is deactivated", async () => {
            await this.token.leaseFrom(this.admin, { from: this.spender, value: this.offerPrice.toString() })
                .should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the terminateLeasing function when contract is deactivated", async () => {
            await this.token.terminateLeasing({ from: this.admin }).should.be.rejectedWith("revert");
        });

    });

});