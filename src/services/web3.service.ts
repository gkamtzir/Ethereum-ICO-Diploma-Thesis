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
    public privateSaleContract: any;

    constructor(
        public OpenHouseToken: any,
        public PrivateSale: any
    ) {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://83.212.115.201:5555"));
        
        let tokenContractaddress = "0x8d0E3b91823d984967319727E926fDD1e8E928C7";
        let privateSaleContractAddress = "0xd3a3685D5e7D786390ec0eA868B6FBB55C34f692";

        this.tokenContract = new this.web3.eth.Contract(this.OpenHouseToken.abi, tokenContractaddress);
        this.privateSaleContract = new this.web3.eth.Contract(this.PrivateSale.abi, privateSaleContractAddress);
    }

}