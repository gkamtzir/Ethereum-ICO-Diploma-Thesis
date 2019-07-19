const Web3 = require("web3");

// Contracts.
const OpenHouseToken = require("../build/contracts/OpenHouseToken.json");
const PrivateSale = require("../build/contracts/PrivateSale.json");
const PreICOSale = require("../build/contracts/PreICOSale.json");
const ICOSale = require("../build/contracts/ICOSale.json");

// Establishing a connection with the blockchain via websockets.
let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://83.212.115.201:5555"));

// Instantiating contracts.
tokenContract = new web3.eth.Contract(OpenHouseToken.abi, "0xb030CC59d57f871F097C86783034c658EB23a444");
privateSaleContract = new web3.eth.Contract(PrivateSale.abi, "0x7D294909EA7fB3bd015F1C083AF0445aCFd43c31");
preICOSaleContract = new web3.eth.Contract(PreICOSale.abi, "0xC8B73D244A62D0857C962F54BFd5955320BCB25a");
ICOSaleContract = new web3.eth.Contract(ICOSale.abi, "0xe1dDeA8606A1f761d34938C110b9609590785668");

// Token events.

// 'OfferCreated' event.
tokenContract.events.OfferCreated((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} created an offer for ${data.numberOfTokens} tokens for ${data.duration}`
        + ` at a price of ${data.price} wei.`);
});

// 'OfferRemoved' event.
tokenContract.events.OfferRemoved((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} removed his offer.`);
});

// 'Leased' event.
tokenContract.events.Leased((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} leased from ${data.to}.`);
});

// 'LeasingTerminated' event.
tokenContract.events.LeasingTerminated((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} terminated the leasing to ${data.to}.`);
});

// 'CommitedFromBalance' event.
tokenContract.events.CommitedFromBalance((error, event) => {
    if (error)
        return;

    const data = event.returnValues;
    console.log(`${data.from} commited ${data.numberOfTokens} tokens from balance.`);
});

// 'CommitedFromRented' event.
tokenContract.events.CommitedFromRented((error, event) => {
    if (error)
        return;

    const data = event.returnValues;
    console.log(`${data.from} commited ${data.numberOfTokens} tokens from rented.`);
});

// Private sale events.

// 'Sold' event.
privateSaleContract.events.Sold((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} bought ${data.numberOfTokens} tokens during the private sale.`);
});

// 'Refunded' event.
privateSaleContract.events.Refunded((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;    
    console.log(`${data.from} refunded ${data.numberOfTokens} tokens during the private sale.`);
})

// 'Redeemed' event.
privateSaleContract.events.Redeemed((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} redeemed ${data.numberOfTokens} tokens from the private sale.`);
});

privateSaleContract.events.AddressAllowed((error, event) => {
    if (error)
        return;

    const data = event.returnValues;
    console.log(`${data.allowed} has been allowed to participate in the private sale.`);
});

// Pre-ICO sale events.

// 'Sold' event.
preICOSaleContract.events.Sold((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} bought ${data.numberOfTokens} tokens during the pre-ICO sale.`);
});

// 'Refunded' event.
preICOSaleContract.events.Refunded((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} refunded ${data.numberOfTokens} tokens during the pre-ICO sale.`);
})

// 'Redeemed' event.
preICOSaleContract.events.Redeemed((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} redeemed ${data.numberOfTokens} tokens from the pre-ICO sale.`);
});

// ICO sale events.

// 'Sold' event.
ICOSaleContract.events.Sold((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} bought ${data.numberOfTokens} tokens during the ICO sale.`);
});

// 'Refunded' event.
ICOSaleContract.events.Refunded((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} refunded ${data.numberOfTokens} tokens during the ICO sale.`);
})

// 'Redeemed' event.
ICOSaleContract.events.Redeemed((error, event) => {
    if (error)
        return;
    
    const data = event.returnValues;
    console.log(`${data.from} redeemed ${data.numberOfTokens} tokens from the ICO sale.`);
});

console.log("Watcher is up and running...");