const Web3 = require("web3");

module.exports = {
    // Returns the time of the last mined block in seconds
    latestTime: async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://83.212.115.201:5555"));
        let block = await web3.eth.getBlock('latest');
        return block.timestamp;
    }
}