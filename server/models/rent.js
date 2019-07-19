const mongoose = require("mongoose");

var rent = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    numberOfTokens: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Date,
        required: true
    },
    offerCreatedTimestamp: {
        type: Date,
        required: true
    },
    leasedTo: {
        type: String,
        required: false
    },
    leasedTimestamp: {
        type: Date,
        required: false
    }
});

var Rent = mongoose.model('rent', rent);

module.exports = Rent;