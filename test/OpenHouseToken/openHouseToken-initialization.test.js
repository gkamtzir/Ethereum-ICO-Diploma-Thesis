const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const { basicConfiguration } = require("../../config.js");
const { expect } = require('chai');
const BN = web3.utils.BN;


require('chai')
    .use(require("chai-bn")(BN))

contract("OpenHouseToken -> initialize", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.admin = accounts[basicConfiguration.adminAccount];

        // Helper variables;
        this.power = new BN(10);
        this.power = this.power.pow(new BN(basicConfiguration.decimals));
    });

    describe("Initialization", () => {

        it("Should initialize the contract with the correct name", async () => {
            const name = await this.token.getName();
            expect(name).to.be.equal(basicConfiguration.name);
        });

        it("Should initialize the contract with the correct symbol", async () => {
            const symbol = await this.token.getSymbol();
            expect(symbol).to.be.equal(basicConfiguration.symbol);
        });

        it("Should initialize the contract with the correct decimals", async () => {
            const decimals = await this.token.getDecimals();
            expect(decimals).to.be.bignumber.equal(new BN(basicConfiguration.decimals));
        });

        it("Should initialize the contract with the correct total supply of tokens", async () => {
            const totalSupply = await this.token.getTotalNumberOfTokens();
            expect(totalSupply).to.be.bignumber.equal(new BN(basicConfiguration.totalSupply));
        });

        it("Should initialize the contract with the correct owner", async () => {
            const owner = await this.token.getOwner();
            expect(owner).to.be.equal(this.admin);
        });

        it("Should allocate the entire balance to admin", async () => {
            const balance = await this.token.balanceOf(this.admin);

            let totalSupplyBN = new BN(basicConfiguration.totalSupply);
            totalSupplyBN = totalSupplyBN.mul(this.power);

            expect(balance).to.be.bignumber.equal(totalSupplyBN);
        });

        it("Should set contract's status to active", async () => {
            const status = await this.token.getStatus();
            expect(status).to.be.bignumber.equal(new BN(basicConfiguration.status.activated));
        });

    });

});