module.exports = {
    accounts: 10,
    port: 8545,
    testrpcOptions: "-p 8545",
    testCommand: "truffle test --network coverage",
    norpc: false,
    copyPackages: [],
    skipFiles: ["contracts/Migrations.sol", "libraries/SafeMath.sol"]
};