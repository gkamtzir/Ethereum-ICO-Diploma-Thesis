const { latestTime } = require("./latestTime");

module.exports = {
    /**
     * Increases ganache time by the passed duration in seconds.
     * @param duration The duration of the time. 
     */
    increaseTime: function(duration) {
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

    /**
     * Beware that due to the need of calling two separate ganache methods and rpc calls overhead
     * it's hard to increase time precisely to a target point so design your test to tolerate
     * small fluctuations from time to time.
     *
     * @param target time in seconds
     */
    increaseTimeTo: function(target) {
        let now = latestTime();
        if (target < now) throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`);
        let diff = target - now;
        return module.exports.increaseTime(diff);
    },

    duration: {
        seconds: function (val) { return val; },
        minutes: function (val) { return val * this.seconds(60); },
        hours: function (val) { return val * this.minutes(60); },
        days: function (val) { return val * this.hours(24); },
        weeks: function (val) { return val * this.days(7); },
        years: function (val) { return val * this.days(365); },
    }
}