import * as W3 from "web3";
const Web3 = require("web3");

export default class Web3Service {

    public static $inject = [
        "OpenHouseToken",
        "PrivateSale",
        "OpenHouseTokenContractAddress",
        "PrivateSaleContractAddress"
    ];

    public web3: W3.default;
    public tokenContract: any;
    public privateSaleContract: W3.Contract;

    constructor(
        public OpenHouseToken: any,
        public PrivateSale: any,
        public OpenHouseTokenContractAddress: string,
        public PrivateSaleContractAddress: string
    ) {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://83.212.115.201:5555"));

        this.tokenContract = new this.web3.eth.Contract(this.OpenHouseToken.abi, this.OpenHouseTokenContractAddress);
        this.privateSaleContract = new this.web3.eth.Contract(this.PrivateSale.abi, this.PrivateSaleContractAddress);
    }

}