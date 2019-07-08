module.exports = {
    accounts: 10,
    port: 8545,
    testrpcOptions: "-p 8545",
    testCommand: "truffle test",
    norpc: true,
    copyPackages: [],
    skipFiles: ["Migrations.sol", "SafeMath.sol"]
};