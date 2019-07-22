const mongoose = require("mongoose");

const receipt = mongoose.Schema({
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

const CommitBalance = mongoose.model("commitBalance", receipt);
const CommitRented = mongoose.model("commitRented", receipt);

module.exports = {CommitBalance, CommitRented};