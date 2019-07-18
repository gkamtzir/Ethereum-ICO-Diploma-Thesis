const Web3 = require("web3");

// Contracts.
const OpenHouseToken = require("../build/contracts/OpenHouseToken.json");
const PrivateSale = require("../build/contracts/PrivateSale.json");
const PreICOSale = require("../build/contracts/PreICOSale.json");
const ICOSale = require("../build/contracts/ICOSale.json");

// Establishing a connection with the blockchain via websockets.
let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://83.212.115.201:5555"));

// Instantiating contracts.
tokenContract = new web3.eth.Contract(OpenHouseToken.abi, "0x25312750426b8939a9d184f8DBb7D2C19A791c07");
privateSaleContract = new web3.eth.Contract(PrivateSale.abi, "0x13f4417BbA1731b0d3ae493Ea754c12b375713a7");
preICOSaleContract = new web3.eth.Contract(PreICOSale.abi, "0x0975D77D2cEF039692bb1c138d4e14914561F9C1");
ICOSaleContract = new web3.eth.Contract(ICOSale.abi, "0x96CA45E3967cf4Fc83BD2572819D228f4876b271");

// Private sale events.

// 'Sold' event.
privateSaleContract.events.Sold((error, events) => {
    console.log(error);
    console.log(events);
});

// 'Refunded' event.
privateSaleContract.events.Refunded((error, events) => {
    console.log(error);
    console.log(events);
})

// 'Redeemed' event.
privateSaleContract.events.Redeemed((error, events) => {
    console.log(error);
    console.log(events);
});

console.log("RUNNING");
