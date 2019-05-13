const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract("OpenHouseToken -> ownership", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
        this.spender = accounts[basicConfiguration.spenderAccount];
        this.transferToAccount = accounts[basicConfiguration.transferToAccount];
    });

    describe("Ownership initialization", () => {

        it("Should be owned by admin", async () => {
            const owner = await this.token.getOwner();
            expect(owner).to.be.equal(this.admin);
        });

        it("Should be impossible for a non-admin address to transfer contract's ownership", async () => {
            await this.token.transferOwnership(this.transferToAccount, { from: this.spender }).should.be.rejectedWith("revert");
        });

    });

    describe("Ownership transfer", () => {

        it("Should be possible for admin to transfer contract's ownership", async () => {
            const tx = await this.token.transferOwnership(this.transferToAccount, { from: this.admin }).should.be.fulfilled;

            truffleAssert.eventEmitted(tx, "OwnershipTransfered", event => {
                return event.from === this.admin && event.to === this.transferToAccount;
            });
        });

        it("Should have changed the ownership of the contract", async () => {
            const owner = await this.token.getOwner();
            expect(owner).to.be.equal(this.transferToAccount);
        });

    });

});