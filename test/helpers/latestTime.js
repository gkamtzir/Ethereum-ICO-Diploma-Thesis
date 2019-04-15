module.exports = {
    // Returns the time of the last mined block in seconds
    latestTime: async () => {
        let block = await web3.eth.getBlock('latest');
        return block.timestamp;
    }
}