const mongoose = require("mongoose");

var receipt = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

var Receipt = mongoose.model('receipt', receipt);

module.exports = Receipt;