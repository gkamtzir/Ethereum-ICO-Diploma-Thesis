const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const truffleAssert = require('truffle-assertions');
const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract("OpenHouseToken -> commit", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.commitAccount = accounts[basicConfiguration.commitAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];
        await this.token.transfer(this.commitAccount, basicConfiguration.transferedTokens, { from: this.admin });
    });

    describe("Commit from balance", () => {

        it("Should have zero commited tokens initially", async () => {
            const commited = await this.token.getCommitedFromBalance({ from: this.commitAccount });
            commited.toNumber().should.be.equal(0);
        });

        it("Should be able to commit tokens from balance", async () => {
            const tx = await this.token.commitFromBalance(basicConfiguration.commitFromBalance, { from: this.commitAccount })
                .should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "CommitedFromBalance", event => {
                return event.from === this.commitAccount 
                    && event.numberOfTokens.toNumber() === basicConfiguration.commitFromBalance;
            });
        });

        it("Should decrease the balance of the sender accordingly", async() => {
            const balance = await this.token.balanceOf(this.commitAccount);
            balance.toNumber().should.be.equal(basicConfiguration.transferedTokens - basicConfiguration.commitFromBalance);
        });

        it("Should increase the commited tokens (from balance) of the sender accordingly", async () => {
            const commited = await this.token.getCommitedFromBalance({ from: this.commitAccount });
            commited.toNumber().should.be.equal(basicConfiguration.commitFromBalance);
        });

        it("Should throw an exception when sender tries to commit tokens he does not own", async () => {
            await this.token.commitFromBalance(basicConfiguration.totalSupply, { from: this.commitAccount })
                .should.be.rejectedWith("revert");
        });

        it("Should be able to move the commited tokens back to balance", async () => {
            const tx = await this.token.commitToBalance(basicConfiguration.commitToBalance, { from: this.commitAccount })
                .should.be.fulfilled;
            truffleAssert.eventEmitted(tx, "CommitedToBalance", event => {
                return event.from === this.commitAccount
                    && event.numberOfTokens.toNumber() === basicConfiguration.commitToBalance;
            });
        });

        it("Should decrease the commited tokens of the sender accordingly", async () => {
            const commited = await this.token.getCommitedFromBalance({ from: this.commitAccount });
            commited.toNumber().should.be.equal(basicConfiguration.commitFromBalance - basicConfiguration.commitToBalance);
        });

        it("Should increase the balance of the sender accordingly", async () => {
            const balance = await this.token.balanceOf(this.commitAccount);
            balance.toNumber().should.be.equal(basicConfiguration.transferedTokens - 
                basicConfiguration.commitFromBalance + basicConfiguration.commitToBalance);
        });

        it("Should throw an exception when sender tries to move tokens he does not own from commited to balance", async () => {
            await this.token.commitToBalance(basicConfiguration.commitFromBalance, { from: this.commitAccount })
                .should.be.rejectedWith("revert");
        });

    });

    describe("Commit from rented", () => {

        it("Should have zero tokens commited from rented initially", async () => {
            const commited = await this.token.getCommitedFromRented({ from: this.commitAccount });
            commited.toNumber().should.be.equal(0);
        });

    });

});
