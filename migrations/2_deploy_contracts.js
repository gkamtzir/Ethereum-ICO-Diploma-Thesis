const OpenHouseToken = artifacts.require("OpenHouseToken.sol");
const PrivateSale = artifacts.require("PrivateSale.sol");

const configuration = require("../config.js");
const { duration } = require("../test/helpers/increaseTime");
const { latestTime } = require("../test/helpers/latestTime");
const { ether } = require("../test/helpers/ether");

module.exports = function(deployer) {
    deployer.deploy(OpenHouseToken, configuration.basicConfiguration.totalSupply)
        .then(async instance => {

            let start = await latestTime();
            start += duration.weeks(1);

            let end = start + configuration.privateSale.duration;
            
            let redeemableAfter = await latestTime();
            redeemableAfter += configuration.privateSale.redeemableAfter;

            await deployer.deploy(
                PrivateSale,
                instance.address,
                ether(configuration.privateSale.tokenPrice),
                configuration.privateSale.tokensMinCap,
                configuration.privateSale.tokensMaxCap,
                start,
                end,
                redeemableAfter);
        });
};
