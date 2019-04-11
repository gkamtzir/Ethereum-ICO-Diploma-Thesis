const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../config.js");
const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract("OpenHouseToken -> status", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];
    });

    describe("Status", () => {

        it("Should be activated initially", async () => {
            const status = await this.token.getStatus();
            status.toNumber().should.be.bignumber.equal(basicConfiguration.status.activated);
        });

        it("Should not be possible to deactivate it a non-admin address", async () => {
            await this.token.deactivate({ from: this.spender }).should.be.rejectedWith("revert");
        });

        it("Should be deactivated by admin", async () => {
            await this.token.deactivate({ from: this.admin }).should.be.fulfilled;
        });

        it("Should be impossible to use the approve function when contract is deactivated", async () => {
            await this.token.approve(this.spender, basicConfiguration.approvedTokens, 
                { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the transfer function when contract is deactivated", async () => {
            await this.token.transfer(this.spender, basicConfiguration.transferedTokens, 
                { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the transferFrom function when contract is deactivated", async () => {
            await this.token.transferFrom(this.admin, this.transferToAccount, 
                basicConfiguration.transferedTokens, { from: this.spender }).should.be.rejectedWith("revert");
        });

        it("Should be impossible for a non-admin address to activate the contract", async () => {
            await this.token.activate({ from: this.spender }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the commitToBalance function when contract is deactivated", async () => {
            await this.token.commitToBalance(0, { from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the createOffer function when contract is deactivated", async () => {
            await this.token.createOffer(
                basicConfiguration.offerTokens,
                basicConfiguration.offerPrice,
                basicConfiguration.offerDuration,
                { from: this.admin }
            ).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the removeOffer function when contract is deactivated", async () => {
            await this.token.removeOffer({ from: this.admin }).should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the leaseFrom function when contract is deactivated", async () => {
            await this.token.leaseFrom(this.admin, { from: this.spender, value: basicConfiguration.offerPrice })
                .should.be.rejectedWith("revert");
        });

        it("Should be impossible to use the terminateLeasing function when contract is deactivated", async () => {
            await this.token.terminateLeasing({ from: this.admin }).should.be.rejectedWith("revert");
        });

    });

});