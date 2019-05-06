import * as W3 from "web3";
const Web3 = require("web3");

export default class Web3Service {

    public static $inject = ["OpenHouseToken"];

    public web3: W3.default;
    public tokenContract: any;

    constructor(
        public OpenHouseToken: any
    ) {
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://83.212.115.201:5555"));
        
        let address = "0xfb043373443F8AC9Dc6EB876ab2EDBa567894AC6";

        this.tokenContract = new this.web3.eth.Contract(this.OpenHouseToken.abi, address);
    }

}