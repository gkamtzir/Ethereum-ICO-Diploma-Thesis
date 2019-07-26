const Web3 = require("web3");
const mongoose = require("mongoose");

// Importing contracts.
const OpenHouseToken = require("../../build/contracts/OpenHouseToken.json");
const PrivateSale = require("../../build/contracts/PrivateSale.json");
const PreICOSale = require("../../build/contracts/PreICOSale.json");
const ICOSale = require("../../build/contracts/ICOSale.json");

// Importing models.
const Sale = require("../models/receiptSale").Sale;
const Refund = require("../models/receiptSale").Refund;
const Redeem = require("../models/receiptSale").Redeem;
const Rent = require("../models/rent");
const Allow = require("../models/allow");
const CommitBalance = require("../models/receipt").CommitBalance;
const CommitRented = require("../models/receipt").CommitRented;

// Establishing a connection with the blockchain via websockets.
let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://83.212.115.201:5555"));

// Establishing a connection with the MongoDB.
mongoose.connect("mongodb://localhost:27017/data", { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

// Establishing a conncetion with MongoDB.
db.once("open", function() {

    console.log("Connected");

});

// Instantiating contracts.
tokenContract = new web3.eth.Contract(OpenHouseToken.abi, "0x0Ce1e36847eba6c89192DAa41e0BEa93c4c1dE3E");
privateSaleContract = new web3.eth.Contract(PrivateSale.abi, "0x1dc45eD8aE68342CeEB5DA7643417016AA5bb45d");
preICOSaleContract = new web3.eth.Contract(PreICOSale.abi, "0x388Bed8F9be9b97f89d77Bf36963741D1d1E4cb6");
ICOSaleContract = new web3.eth.Contract(ICOSale.abi, "0x0062e5736843BD16Fb2afb8Ae6D67944484f01D3");

// Token events.

// 'OfferCreated' event.
tokenContract.events.OfferCreated((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} created an offer for ${data.numberOfTokens} tokens for ${data.duration}`
        + ` at a price of ${data.price} wei.`);
    
    // Creating the rent instance.
    let rent = new Rent({
        from: data.from,
        numberOfTokens: data.numberOfTokens,
        price: data.price,
        duration: data.duration,
        offerCreatedTimestamp: Date.now(),
        leasedTo: null,
        leasedTimestamp: null
    });

    // Saving the instance to DB.
    rent.save(error => {
        if (error)
            console.log(error);
    });
});

// 'OfferRemoved' event.
tokenContract.events.OfferRemoved((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} removed his offer.`);

    // Deleting the offer from DB.
    Rent.deleteOne({from: data.from}, error => {
        if (error)
            console.log(error);
    });
});

// 'Leased' event.
tokenContract.events.Leased((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} leased from ${data.to}.`);

    // Updating the offer (adding the renter).
    Rent.updateOne({from: data.from}, {leasedTo: data.to, leasedTimestamp: Date.now()},
        error => {
            if (error)
                console.log(error);
        });
});

// 'LeasingTerminated' event.
tokenContract.events.LeasingTerminated((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} terminated the leasing to ${data.to}.`);

    // Updating the offer (removing the renter).
    Rent.updateOne({from: data.from}, {leasedTo: null, leasedTimestamp: null},
        error => {
            if (error)
                console.log(error);
        });
});

// 'CommitedFromBalance' event.
tokenContract.events.CommitedFromBalance((error, event) => {
    if (error)
        return;

    const data = event.returnValues;
    console.log(`${data.from} commited ${data.numberOfTokens} tokens from balance.`);

    const commitBalance = new CommitBalance({
        from: data.from,
        amount: data.numberOfTokens,
        timestamp: Date.now()
    });

    // Saving the instance to DB.
    commitBalance.save(error => {
        if (error)
            console.log(error);
    });
});

// 'CommitedFromRented' event.
tokenContract.events.CommitedFromRented((error, event) => {
    if (error)
        return;

    const data = event.returnValues;
    console.log(`${data.from} commited ${data.numberOfTokens} tokens from rented.`);

    const commitRented = new CommitRented({
        from: data.from,
        amount: data.numberOfTokens,
        timestamp: Date.now()
    });

    // Saving the instance to DB.
    commitRented.save(error => {
        if (error)
            console.log(error);
    });
});

// Private sale events.

// 'Sold' event.
privateSaleContract.events.Sold((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} bought ${data.numberOfTokens} tokens during the private sale.`);

    // Saving the instance to DB.
    saveSale(data, "private");
});

// 'Refunded' event.
privateSaleContract.events.Refunded((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;    
    console.log(`${data.from} refunded ${data.numberOfTokens} tokens during the private sale.`);

    // Saving the instance to DB.
    saveRefund(data, "private");
})

// 'Redeemed' event.
privateSaleContract.events.Redeemed((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} redeemed ${data.numberOfTokens} tokens from the private sale.`);
    
    // Saving the instance to DB.
    saveRedeem(data, "private");
});

privateSaleContract.events.AddressAllowed((error, event) => {
    if (error)
        return;

    const data = event.returnValues;
    console.log(`${data.allowed} has been allowed to participate in the private sale.`);

    const allow = new Allow({
        allowed: data.allowed,
        timestamp: Date.now()
    });

    // Saving the instance to DB.
    allow.save(error => {
        if (error)
            console.log(error);
    });
});

// Pre-ICO sale events.

// 'Sold' event.
preICOSaleContract.events.Sold((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} bought ${data.numberOfTokens} tokens during the pre-ICO sale.`);

    // Saving the instance to DB.
    saveSale(data, "pre");
});

// 'Refunded' event.
preICOSaleContract.events.Refunded((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} refunded ${data.numberOfTokens} tokens during the pre-ICO sale.`);

    // Saving the instance to DB.
    saveRefund(data, "pre");
})

// 'Redeemed' event.
preICOSaleContract.events.Redeemed((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} redeemed ${data.numberOfTokens} tokens from the pre-ICO sale.`);

    // Saving the instance to DB.
    saveRedeem(data, "pre");
});

// ICO sale events.

// 'Sold' event.
ICOSaleContract.events.Sold((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} bought ${data.numberOfTokens} tokens during the ICO sale.`);

    // Saving the instance to DB.
    saveSale(data, "ico");
});

// 'Refunded' event.
ICOSaleContract.events.Refunded((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} refunded ${data.numberOfTokens} tokens during the ICO sale.`);

    // Saving the instance to DB.
    saveRefund(data, "ico");
})

// 'Redeemed' event.
ICOSaleContract.events.Redeemed((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} redeemed ${data.numberOfTokens} tokens from the ICO sale.`);

    // Saving the instance to DB.
    saveRedeem(data, "ico");
});

function saveSale(data, stage) {
    const sale = new Sale({
        from: data.from,
        amount: data.numberOfTokens,
        stage,
        timestamp: Date.now()
    });

    // Saving the instance to DB.
    sale.save(error => {
        if (error)
            console.log(error);
    });
}

function saveRefund(data, stage) {
    const refund = new Refund({
        from: data.from,
        amount: data.numberOfTokens,
        stage,
        timestamp: Date.now()
    });

    // Saving the instance to DB.
    refund.save(error => {
        if (error)
            console.log(error);
    });
}

function saveRedeem(data, stage) {
    const redeem = new Redeem({
        from: data.from,
        amount: data.numberOfTokens,
        stage,
        timestamp: Date.now()
    });

    // Saving the instance to DB.
    redeem.save(error => {
        if (error)
            console.log(error);
    });
}

console.log("Watcher is up and running...");