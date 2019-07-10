const OpenHouseToken = artifacts.require("OpenHouseToken.sol");
const PrivateSale = artifacts.require("PrivateSale.sol");
const PreICOSale = artifacts.require("PreICOSale.sol");
const ICOSale = artifacts.require("ICOSale.sol");

const configuration = require("../config.js");
const { duration } = require("../test/helpers/increaseTime");
const { latestTime } = require("../test/helpers/latestTime");

const BN = web3.utils.BN;

/**
 * Deployes the private sale contract.
 * @param openHouseInstance The token instance
 * @param deployer The deployer instance
 */
async function deployPrivateSale(openHouseInstance, deployer) {
    let start = await latestTime();
    start += duration.weeks(4);

    let end = start + configuration.privateSale.duration;
    
    let redeemableAfter = await latestTime();
    redeemableAfter += configuration.privateSale.redeemableAfter;

    const privateSaleInstance = await deployer.deploy(
        PrivateSale,
        openHouseInstance.address,
        configuration.privateSale.tokenPrice,
        configuration.privateSale.tokensMinCap,
        configuration.privateSale.tokensMaxCap,
        configuration.basicConfiguration.decimals,
        start,
        end,
        redeemableAfter);

    return privateSaleInstance;
}

/**
 * Deploys the pre-ICO sale contract.
 * @param openHouseInstance The token instance
 * @param deployer The deployer instance
 */
async function deployPreICOSale(openHouseInstance, deployer) {
    let start = await latestTime();
    start += duration.weeks(12);

    let end = start + configuration.preICOSale.duration;
    
    let redeemableAfter = await latestTime();
    redeemableAfter += configuration.preICOSale.redeemableAfter;

    const preICOSaleInstance = await deployer.deploy(
        PreICOSale,
        openHouseInstance.address,
        configuration.preICOSale.tokenPrice,
        configuration.preICOSale.tokensMinCap,
        configuration.preICOSale.tokensMaxCap,
        configuration.basicConfiguration.decimals,
        start,
        end,
        redeemableAfter);

    return preICOSaleInstance;
}

/**
 * Deploys the ICO sale contract.
 * @param openHouseInstance The token instance
 * @param deployer The deployer instance
 */
async function deployICOSale(openHouseInstance, deployer) {
    let start = await latestTime();
    start += duration.weeks(20);

    let end = start + configuration.ICOSale.duration;
    
    let redeemableAfter = await latestTime();
    redeemableAfter += configuration.ICOSale.redeemableAfter;

    const ICOSaleInstance = await deployer.deploy(
        ICOSale,
        openHouseInstance.address,
        configuration.ICOSale.tokenPrice,
        configuration.ICOSale.tokensMinCap,
        configuration.ICOSale.tokensMaxCap,
        configuration.basicConfiguration.decimals,
        start,
        end,
        redeemableAfter);

    return ICOSaleInstance;
}

/**
 * Transfer the needed funds from OpenHouseToken contract to
 * the corresponding sale contract.
 * @param openHouseInstance The token instance
 * @param contractAddress Sale's contract address.
 * @param funds The number of tokens to be transfered. 
 */
async function transferFunds(openHouseInstance, contractAddress, funds) {
    let power = new BN(10);
    power = power.pow(new BN(configuration.basicConfiguration.decimals));

    await openHouseInstance.transfer(contractAddress, funds.mul(power).toString());
}

module.exports = async (deployer) => {
    deployer.deploy(OpenHouseToken, configuration.basicConfiguration.totalSupply)
        .then(async (openHouseInstance) => {
            // Deploying private sale contract and transfering the corresponding funds.
            const privateSaleInstance = await deployPrivateSale(openHouseInstance, deployer);
            const privateSaleTokens = new BN(configuration.privateSale.tokensMaxCap);
            await transferFunds(openHouseInstance, privateSaleInstance.address, privateSaleTokens);

            // Deploying pre-ICO sale contract and transfering the corresponding funds.
            const preICOSaleInstance = await deployPreICOSale(openHouseInstance, deployer);
            const preICOSaleTokens = new BN(configuration.preICOSale.tokensMaxCap);
            await transferFunds(openHouseInstance, preICOSaleInstance.address, preICOSaleTokens);

            // Deploying ICO sale contract and transfering the corresponding funds.
            const ICOSaleInstance = await deployICOSale(openHouseInstance, deployer);
            const ICOSaleTokens = new BN(configuration.ICOSale.tokensMaxCap);
            await transferFunds(openHouseInstance, ICOSaleInstance.address, ICOSaleTokens);
        });
};
