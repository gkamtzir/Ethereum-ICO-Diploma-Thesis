const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const BN = web3.utils.BN;

require('chai')
    .use(require('chai-as-promised'))
    .use(require("chai-bn")(BN))
    .should();

contract("OpenHouseToken -> commit", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.commitAccount = accounts[basicConfiguration.commitAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];

        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));

        this.transferedTokens = new BN(basicConfiguration.transferedTokens);
        this.transferedTokens = this.transferedTokens.mul(this.power);

        this.offerTokens = new BN(basicConfiguration.offerTokens);
        this.offerTokens = this.offerTokens.mul(this.power);

        this.totalSupply = new BN(basicConfiguration.totalSupply);
        this.totalSupply = this.totalSupply.mul(this.power);

        this.offerPrice = new BN(basicConfiguration.offerPrice);

        this.commitFromBalance = new BN(basicConfiguration.commitFromBalance);
        this.commitFromBalance = this.commitFromBalance.mul(this.power);

        this.commitToBalance = new BN(basicConfiguration.commitToBalance);
        this.commitToBalance = this.commitToBalance.mul(this.power);

        await this.token.transfer(this.commitAccount, this.transferedTokens.toString(), { from: this.admin });
        
        await this.token.createOffer(
            this.offerTokens.toString(),
            this.offerPrice.toString(),
            basicConfiguration.offerDuration,
            { from: this.admin }
        );
    });

    describe("Commit from balance", () => {

        it("Should have zero commited tokens initially", async () => {
            const commited = await this.token.getCommitedFromBalance({ from: this.commitAccount });
            expect(commited).to.be.bignumber.equal(new BN(0));
        });

        it("Should be able to commit tokens from balance", async () => {
            const tx = await this.token.commitFromBalance(this.commitFromBalance.toString(), { from: this.commitAccount })
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "CommitedFromBalance", event => {
                return event.from === this.commitAccount 
                    && event.numberOfTokens.eq(this.commitFromBalance);
            });
        });

        it("Should decrease the balance of the sender accordingly", async() => {
            const balance = await this.token.balanceOf(this.commitAccount);
            expect(balance).to.be.bignumber.equal(this.transferedTokens.sub(this.commitFromBalance));
        });

        it("Should increase the commited tokens (from balance) of the sender accordingly", async () => {
            const commited = await this.token.getCommitedFromBalance({ from: this.commitAccount });
            expect(commited).to.be.bignumber.equal(this.commitFromBalance);
        });

        it("Should throw an exception when sender tries to commit tokens he does not own", async () => {
            await this.token.commitFromBalance(this.totalSupply.toString(), { from: this.commitAccount })
                .should.be.rejectedWith("revert");
        });

        it("Should be able to move the commited tokens back to balance", async () => {
            const tx = await this.token.commitToBalance(this.commitToBalance, { from: this.commitAccount })
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "CommitedToBalance", event => {
                return event.from === this.commitAccount
                    && event.numberOfTokens.eq(this.commitToBalance);
            });
        });

        it("Should decrease the commited tokens of the sender accordingly", async () => {
            const commited = await this.token.getCommitedFromBalance({ from: this.commitAccount });
            expect(commited).to.be.bignumber.equal(this.commitFromBalance.sub(this.commitToBalance));
        });

        it("Should increase the balance of the sender accordingly", async () => {
            const balance = await this.token.balanceOf(this.commitAccount);
            expect(balance).to.be.bignumber.equal(this.transferedTokens.sub(this.commitFromBalance).add(this.commitToBalance));
        });

        it("Should throw an exception when sender tries to move tokens he does not own from commited to balance", async () => {
            await this.token.commitToBalance(this.commitFromBalance.toString(), { from: this.commitAccount })
                .should.be.rejectedWith("revert");
        });

    });

    describe("Commit from rented", () => {

        it("Should have zero tokens commited from rented initially", async () => {
            const commited = await this.token.getCommitedFromRented({ from: this.commitAccount });
            expect(commited).to.be.bignumber.equal(new BN(0));
        });

        it("Should throw an exception when sender tries to commit from rented without even renting", async() => {
            await this.token.commitFromRented(10, { from: this.commitAccount })
                .should.be.rejectedWith("revert");
        });

        it("Should throw an exception when sender tries to withdraw tokens from rented withou even renting", async () => {
            await this.token.commitToRented(10, { from: this.commitAccount })
                .should.be.rejectedWith("revert");
        });

        it("Should be able to commit from the rented tokens", async () => {
            await this.token.leaseFrom(this.admin, 
                { from: this.commitAccount, value: this.offerPrice.toString()})
                .should.be.fulfilled;

            this.commitedTokens = this.offerTokens.div(new BN(2));

            const tx = await this.token.commitFromRented(this.commitedTokens.toString(),
                { from: this.commitAccount }).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "CommitedFromRented", event => {
                return event.from === this.commitAccount
                    && event.numberOfTokens.eq(this.commitedTokens);
            });
        });

        it("Should throw an exception when user tries to commit from rented tokens he does not own", async () => {
            await this.token.commitFromRented(this.commitedTokens.mul(new BN(2)).toString(), { from: this.commitAccount })
                .should.be.rejectedWith("revert");
        });

        it("Should be able to modify the commited instances properly", async () => {
            const commited = await this.token.getCommitedFromRented({ from: this.commitAccount });
            expect(commited).to.be.bignumber.equal(this.commitedTokens);
        });

        it("Should be able to modify the rented instances properly", async () => {
            const availableTokens = await this.token.getRentedAvailableTokens(this.commitAccount);
            expect(availableTokens).to.be.bignumber.equal(this.offerTokens.sub(this.commitedTokens));
        });

        it("Shoule be able to move commited tokens back to rented", async () => {
            const tx = await this.token.commitToRented(this.commitedTokens.toString(), { from: this.commitAccount })
                .should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "CommitedToRented", event => {
                return event.from === this.commitAccount
                    && event.numberOfTokens.eq(this.commitedTokens);
            });
        });

        it("Should throw an exception when sender tries to withraw insufficient tokens from rented", async () => {
            await this.token.commitToRented(1, { from: this.commitAccount })
                .should.be.rejectedWith("revert");
        });

    });

});
