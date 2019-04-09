module.exports = {
    // Returns the time of the last mined block in seconds
    latestTime: function() {
        return web3.eth.getBlock('latest').timestamp;
    }
}