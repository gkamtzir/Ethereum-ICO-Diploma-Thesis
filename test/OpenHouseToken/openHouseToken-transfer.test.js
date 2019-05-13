const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const truffleAssert = require('truffle-assertions');
const { expect } = require('chai');
const BN = web3.utils.BN;

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("OpenHouseToken -> transfer", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.noTokensAccount = accounts[basicConfiguration.noTokensAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];

        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.totalSupply = new BN(basicConfiguration.totalSupply);
        this.totalSupply = this.totalSupply.mul(this.power);

        this.transferedTokens = new BN(basicConfiguration.transferedTokens);
        this.transferedTokens = this.transferedTokens.mul(this.power);
    });

    describe("Transfer", () => {

        it("Should have zero tokens initially (non-admin address)", async () => {
            const balance = await this.token.balanceOf(this.transferToAccount);
            expect(balance).to.be.bignumber.equal(new BN(0));
        });

        it("Should have all the supply initially (admin)", async () => {
            const balance = await this.token.balanceOf(this.admin);
            expect(balance).to.be.bignumber.equal(this.totalSupply);
        });

        it("Should be able to transfer tokens", async () => {
            const tx = await this.token.transfer(this.transferToAccount, this.transferedTokens, 
                { from: this.admin }).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Transfer", event => {
                return event.from === this.admin && event.to === this.transferToAccount
                    && event.value.eq(this.transferedTokens);
            });
        });

        it("Should have decreased sender's balance accordingly", async () => {
            const balance = await this.token.balanceOf(this.admin);
            expect(balance).to.be.bignumber.equal(this.totalSupply.sub(this.transferedTokens));
        });

        it("Should have increased receiver's balance accordingly", async () => {
            const balance = await this.token.balanceOf(this.transferToAccount);
            expect(balance).to.be.bignumber.equal(this.transferedTokens);
        });

        it("Should throw an exception when sender's balance is insufficient", async () => {
            await this.token.transfer(this.transferToAccount, this.transferedTokens, 
                { from: this.noTokensAccount }).should.be.rejectedWith("revert");
        });

        it("Should not have any effect on sender's balance", async () => {
            const balance = await this.token.balanceOf(this.noTokensAccount);
            expect(balance).to.be.bignumber.equal(new BN(0));
        });

        it("Should not have any effect on receiver's balance", async () => {
            const balance = await this.token.balanceOf(this.transferToAccount);
            expect(balance).to.be.bignumber.equal(this.transferedTokens);
        });

    });

});