const OpenHouseToken = artifacts.require("OpenHouseToken.sol");

module.exports = function(deployer) {
  deployer.deploy(OpenHouseToken);
};
