const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const truffleAssert = require('truffle-assertions');
const { expect } = require('chai');
const BN = web3.utils.BN;

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should()

contract("OpenHouseToken -> approve/transfer from", accounts => {

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

        this.totalSupply = new BN(basicConfiguration.totalSupply);
        this.totalSupply = this.totalSupply.mul(this.power);

        this.transferedTokens = new BN(basicConfiguration.transferedTokens);
        this.transferedTokens = this.transferedTokens.mul(this.power);
    });

    describe("Approve", () => {

        it("Should be able to approve a specified amount of tokens to be spent from another address",
            async () => {
                const tx = await this.token.approve(this.spender, this.approvedTokens.toString(),
                    { from: this.admin }).should.be.fulfilled;

                truffleAssert.eventEmitted(tx, "Approval", event => {
                    return event.from === this.admin && event.to === this.spender
                        && event.value.eq(this.approvedTokens);
                });
        });

        it("Should have increased the allowance of receiver accordingly", async () => {
            const allowance = await this.token.allowance(this.admin, this.spender);
            expect(allowance).to.be.bignumber.equal(this.approvedTokens);
        });

        it("Should be able to approve any amount of tokens", async () => {
            const tx = await this.token.approve(this.transferToAccount, this.totalSupply, 
                { from: this.admin }).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Approval", event => {
                return event.from === this.admin && event.to === this.transferToAccount
                    && event.value.eq(this.totalSupply);
            });
        });

    });

    describe("Transfer from", () => {

        it("Should be able to transfer token on behalf of another address", async () => {
            const tx = await this.token.transferFrom(this.admin, this.transferToAccount, this.transferedTokens,
                { from: this.spender }).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "Transfer", event => {
                return event.from === this.admin && event.to === this.transferToAccount
                    && event.value.eq(this.transferedTokens);
            });
        });

        it("Should decreased the balance of the address whose tokens were transfered accordingly", async () => {
            const balance = await this.token.balanceOf(this.admin);
            expect(balance).to.be.bignumber.equal(this.totalSupply.sub(this.transferedTokens));
        });

        it("Should increased the balance of the address at which the tokens were sent accordingly", async () => {
            const balance = await this.token.balanceOf(this.transferToAccount);
            expect(balance).to.be.bignumber.equal(this.transferedTokens);
        });

        it("Should decrease the allowance of the sender accordingly", async () => {
            const allowance = await this.token.allowance(this.admin, this.spender);
            expect(allowance).to.be.bignumber.equal(new BN(0));
        });

        it("Should throw an exception when spender's allowance is insufficient", async () => {
            await this.token.transferFrom(this.admin, this.transferToAccount, this.transferedTokens,
                { from: this.spender}).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when the balance of the address whose tokens are approved for transfer are insufficient",
            async () => {
                await this.token.transferFrom(this.admin, this.spender, this.totalSupply,
                    { from: this.transferToAccount }).should.be.rejectedWith("revert");
        });

    });

});