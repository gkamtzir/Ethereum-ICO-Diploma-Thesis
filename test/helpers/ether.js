const Web3 = require("web3");

module.exports = {
    /**
     * Returns the given ether value to wei.
     * @param number The value in ether.
     */
    ether: (number) => {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://83.212.115.201:5555"));
        return new web3.utils.BN(web3.utils.toWei(number.toString(), "ether"));
    }
}