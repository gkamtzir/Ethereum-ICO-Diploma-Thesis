const mongoose = require("mongoose");

const allow = mongoose.Schema({
    allowed: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

const Allow = mongoose.model("allow", allow);

module.exports = Allow;