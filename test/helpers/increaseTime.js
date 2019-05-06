const Web3 = require("web3");

module.exports = {
    /**
     * Increases ganache time by the passed duration in seconds.
     * @param duration The duration of the time. 
     */
    increaseTime: async (duration) => {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://83.212.115.201:5555"));
        const id = Date.now();

        return new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_increaseTime',
                params: [duration],
                id: id,
            }, err1 => {
                if (err1) return reject(err1);

                web3.currentProvider.send({
                    jsonrpc: '2.0',
                    method: 'evm_mine',
                    id: id + 1,
                }, (err2, res) => {
                    return err2 ? reject(err2) : resolve(res);
                });
            });
        });
    },

    duration: {
        seconds: val => { return val; },
        minutes: val => { return val * module.exports.duration.seconds(60); },
        hours: val => { return val * module.exports.duration.minutes(60); },
        days: val => { return val * module.exports.duration.hours(24); },
        weeks: val => { return val * module.exports.duration.days(7); },
        years: val => { return val * module.exports.duration.days(365); },
    }
}