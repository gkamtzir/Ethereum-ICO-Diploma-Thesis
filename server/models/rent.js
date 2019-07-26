const mongoose = require("mongoose");

const rent = mongoose.Schema({
    from: {
        type: String,
        required: true,
        unique: true
    },
    numberOfTokens: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    duration: {
        type: String,
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

const Rent = mongoose.model("rent", rent);

module.exports = Rent;