const OpenHouseToken = artifacts.require("OpenHouseToken.sol");
const PrivateSale = artifacts.require("PrivateSale.sol");
const PreICOSale = artifacts.require("PreICOSale.sol");
const ICOSale = artifacts.require("ICOSale.sol");

const configuration = require("../config.js");
const { duration } = require("../test/helpers/increaseTime");
const { latestTime } = require("../test/helpers/latestTime");
const { ether } = require("../test/helpers/ether");

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

    await deployer.deploy(
        PrivateSale,
        openHouseInstance.address,
        ether(configuration.privateSale.tokenPrice),
        configuration.privateSale.tokensMinCap,
        configuration.privateSale.tokensMaxCap,
        start,
        end,
        redeemableAfter);
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

    await deployer.deploy(
        PreICOSale,
        openHouseInstance.address,
        ether(configuration.preICOSale.tokenPrice),
        configuration.preICOSale.tokensMinCap,
        configuration.preICOSale.tokensMaxCap,
        start,
        end,
        redeemableAfter);
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

    await deployer.deploy(
        ICOSale,
        openHouseInstance.address,
        ether(configuration.ICOSale.tokenPrice),
        configuration.ICOSale.tokensMinCap,
        configuration.ICOSale.tokensMaxCap,
        start,
        end,
        redeemableAfter);
}

module.exports = async (deployer) => {
    deployer.deploy(OpenHouseToken, configuration.basicConfiguration.totalSupply)
        .then(async (openHouseInstance) => {
            await deployPrivateSale(openHouseInstance, deployer);
            await deployPreICOSale(openHouseInstance, deployer);
            await deployICOSale(openHouseInstance, deployer);
        });
};
