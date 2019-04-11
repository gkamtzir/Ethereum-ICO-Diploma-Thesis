const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const truffleAssert = require('truffle-assertions');
const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract("OpenHouseToken -> approve/transfer from", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];
    });

    describe("Approve", () => {

        it("Should be able to approve a specified amount of tokens to be spent from another address",
            async () => {
                const tx = await this.token.approve(this.spender, basicConfiguration.approvedTokens,
                    { from: this.admin }).should.be.fulfilled;
                truffleAssert.eventEmitted(tx, "Approval", event => {
                    return event.from === this.admin && event.to === this.spender
                        && event.value.toNumber() === basicConfiguration.approvedTokens;
                });
        });

        it("Should have increased the allowance of receiver accordingly", async () => {
            const allowance = await this.token.allowance(this.admin, this.spender);
            allowance.toNumber().should.be.equal(basicConfiguration.approvedTokens);
        });

        it("Should be able to approve any amount of tokens", async () => {
            const tx = await this.token.approve(this.transferToAccount, basicConfiguration.totalSupply, 
                { from: this.admin }).should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "Approval", event => {
                return event.from === this.admin && event.to === this.transferToAccount
                    && event.value.toNumber() === basicConfiguration.totalSupply;
            });
        });

    });

    describe("Transfer from", () => {

        it("Should be able to transfer token on behalf of another address", async () => {
            const tx = await this.token.transferFrom(this.admin, this.transferToAccount, basicConfiguration.transferedTokens,
                { from: this.spender }).should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "Transfer", event => {
                return event.from === this.admin && event.to === this.transferToAccount
                    && event.value.toNumber() === basicConfiguration.transferedTokens;
            });
        });

        it("Should decreased the balance of the address whose tokens were transfered accordingly", async () => {
            const balance = await this.token.balanceOf(this.admin);
            balance.toNumber().should.be.equal(basicConfiguration.totalSupply - basicConfiguration.transferedTokens);
        });

        it("Should increased the balance of the address at which the tokens were sent accordingly", async () => {
            const balance = await this.token.balanceOf(this.transferToAccount);
            balance.toNumber().should.be.equal(basicConfiguration.transferedTokens);
        });

        it("Should decrease the allowance of the sender accordingly", async () => {
            const allowance = await this.token.allowance(this.admin, this.spender);
            allowance.toNumber().should.be.equal(0);
        });

        it("Should throw an exception when spender's allowance is insufficient", async () => {
            await this.token.transferFrom(this.admin, this.transferToAccount, basicConfiguration.transferedTokens,
                { from: this.spender}).should.be.rejectedWith("revert");
        });

        it("Should throw an exception when the balance of the address whose tokens are approved for transfer are insufficient",
            async () => {
                await this.token.transferFrom(this.admin, this.spender, basicConfiguration.totalSupply,
                    { from: this.transferToAccount }).should.be.rejectedWith("revert");
        })

    });

});