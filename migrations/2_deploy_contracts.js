const OpenHouseToken = artifacts.require("OpenHouseToken.sol");

const configuration = require("../config.js");

module.exports = function(deployer) {
  deployer.deploy(OpenHouseToken, configuration.basicConfiguration.totalSupply);
};
