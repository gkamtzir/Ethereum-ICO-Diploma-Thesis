const { latestTime } = require("./latestTime");

module.exports = {
    /**
     * Increases ganache time by the passed duration in seconds.
     * @param duration The duration of the time. 
     */
    increaseTime: async (duration) => {
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