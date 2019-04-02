const OpenHouseToken = artifacts.require("OpenHouseToken.sol");

const totalSupply = 1000000;

module.exports = function(deployer) {
  deployer.deploy(OpenHouseToken, totalSupply);
};
