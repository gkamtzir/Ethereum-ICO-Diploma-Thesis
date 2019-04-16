const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const truffleAssert = require('truffle-assertions');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract("OpenHouseToken -> transfer", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.noTokensAccount = accounts[basicConfiguration.noTokensAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];
    });

    describe("Transfer", () => {

        it("Should have zero tokens initially (non-admin address)", async () => {
            const balance = await this.token.balanceOf(this.transferToAccount);
            balance.toNumber().should.be.equal(0);
        });

        it("Should have all the supply initially (admin)", async () => {
            const balance = await this.token.balanceOf(this.admin);
            balance.toNumber().should.be.equal(basicConfiguration.totalSupply);
        });

        it("Should be able to transfer tokens", async () => {
            const tx = await this.token.transfer(this.transferToAccount, basicConfiguration.transferedTokens, 
                { from: this.admin }).should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "Transfer", event => {
                return event.from === this.admin && event.to === this.transferToAccount
                    && event.value.toNumber() === basicConfiguration.transferedTokens;
            });
        });

        it("Should have decreased sender's balance accordingly", async () => {
            const balance = await this.token.balanceOf(this.admin);
            balance.toNumber().should.be.equal(basicConfiguration.totalSupply - basicConfiguration.transferedTokens);
        });

        it("Should have increased receiver's balance accordingly", async () => {
            const balance = await this.token.balanceOf(this.transferToAccount);
            balance.toNumber().should.be.equal(basicConfiguration.transferedTokens);
        });

        it("Should throw an exception when sender's balance is insufficient", async () => {
            await this.token.transfer(this.transferToAccount, basicConfiguration.transferedTokens, 
                { from: this.noTokensAccount }).should.be.rejectedWith("revert");
        });

        it("Should not have any effect on sender's balance", async () => {
            const balance = await this.token.balanceOf(this.noTokensAccount);
            balance.toNumber().should.be.equal(0);
        });

        it("Should not have any effect on receiver's balance", async () => {
            const balance = await this.token.balanceOf(this.transferToAccount);
            balance.toNumber().should.be.equal(basicConfiguration.transferedTokens);
        });

    });

});