const OpenHouseToken = artifacts.require("./OpenHouseToken.sol");
const PrivateSale = artifacts.require("./PrivateSale.sol");
const { basicConfiguration, privateSale } = require("../../config.js");
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract("PrivateSale -> initialize", accounts => {

    before(async () => {
        this.token = await OpenHouseToken.new(basicConfiguration.totalSupply);
        this.privateSale = await PrivateSale.new(
            this.token.address,
            privateSale.tokenPrice,
            privateSale.tokensMinCap,
            privateSale.tokensMaxCap
        );
        this.admin = accounts[basicConfiguration.adminAccount];
    });

    describe("Initialization", () => {

        it("Should initialize private sale with the correct owner", async () => {
            const owner = await this.privateSale.getOwner();
            owner.should.be.equal(this.admin);
        });

        it("Should initialize private sale with the correct price", async () => {
            const price = await this.privateSale.getTokenPrice();
            price.toNumber().should.be.equal(privateSale.tokenPrice);
        });

        it("Should initialize private sale with the correct minimum cap", async () => {
            const minCap = await this.privateSale.getTokensMinCap();
            minCap.toNumber().should.be.equal(privateSale.tokensMinCap);
        });

        it("Should initialize private sale with the correct maximum cap", async () => {
            const maxCap = await this.privateSale.getTokensMaxCap();
            maxCap.toNumber().should.be.equal(privateSale.tokensMaxCap);
        });

        it("Should initialize private sale with the zero sold tokens", async () => {
            const soldTokens = await this.privateSale.getTokensSold();
            soldTokens.toNumber().should.be.equal(0);
        });

    });

});