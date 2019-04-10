const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../config.js");
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract("OpenHouseToken", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];
    });

    describe("OpenHouseToken contract initialization", () => {

        it("Should initialize the contract with the correct name", async () => {
            const name = await this.token.getName();
            name.should.equal(basicConfiguration.name);
        });

        it("Should initialize the contract with the correct symbol", async () => {
            const symbol = await this.token.getSymbol();
            symbol.should.equal(basicConfiguration.symbol );
        });

        it("Should initialize the contract with the correct decimals", async () => {
            const decimals = await this.token.getDecimals();
            decimals.toNumber().should.be.bignumber.equal(basicConfiguration.decimals);
        });

        it("Should initialize the contract with the correct total supply", async () => {
            const totalSupply = await this.token.totalSupply();
            totalSupply.toNumber().should.be.bignumber.equal(basicConfiguration.totalSupply);
        });

        it("Should initialize the contract with the correct owner", async () => {
            const owner = await this.token.getOwner();
            owner.should.equal(this.admin);
        });

        it("Should allocate the entire balance to admin", async () => {
            const balance = await this.token.balanceOf(this.admin);
            balance.toNumber().should.be.bignumber.equal(basicConfiguration.totalSupply);
        });

        it("Should set contract's status to active", async () => {
            const status = await this.token.getStatus();
            status.toNumber().should.be.bignumber.equal(basicConfiguration.status.activated);
        });

    });

});