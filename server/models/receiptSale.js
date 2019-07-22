const mongoose = require("mongoose");

const receiptSale = mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    stage: {
        type: String,
        enum: ['private', 'pre', 'ico'],
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

const Sale = mongoose.model("sale", receiptSale);
const Refund = mongoose.model("refund", receiptSale);
const Redeem = mongoose.model("redeem", receiptSale);

module.exports = {Sale, Refund, Redeem};