import * as W3 from "web3";
const Web3 = require("web3");

declare var web3;
declare var ethereum;

export default class Web3Service {

    // Service"s injectables.
    public static $inject = [
        "OpenHouseToken",
        "PrivateSale",
        "PreICOSale",
        "ICOSale",
        "OpenHouseTokenContractAddress",
        "PrivateSaleContractAddress",
        "PreICOSaleContractAddress",
        "ICOSaleContractAddress",
        "toastr",
        "$rootScope"
    ];

    // Public variables.
    public web3: W3.default;
    public tokenContract: any;
    public privateSaleContract: any;
    public preICOSaleContract: any;
    public ICOSaleContract: any;

    constructor(
        public OpenHouseToken: any,
        public PrivateSale: any,
        public PreICOSale: any,
        public ICOSale: any,
        public OpenHouseTokenContractAddress: string,
        public PrivateSaleContractAddress: string,
        public PreICOSaleContractAddress: string,
        public ICOSaleContractAddress: string,
        public toastr: ng.toastr.IToastrService,
        public $rootScope: ng.IRootScopeService
    ) {
        if (typeof web3 !== "undefined")
            this.web3 = new Web3(web3.currentProvider);
        else
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://83.212.115.201:5555"));

        this.tokenContract = new this.web3.eth.Contract(this.OpenHouseToken.abi, this.OpenHouseTokenContractAddress);
        this.privateSaleContract = new this.web3.eth.Contract(this.PrivateSale.abi, this.PrivateSaleContractAddress);
        this.preICOSaleContract = new this.web3.eth.Contract(this.PreICOSale.abi, this.PreICOSaleContractAddress);
        this.ICOSaleContract = new this.web3.eth.Contract(this.ICOSale.abi, this.ICOSaleContractAddress);

        // Watching for account changes.
        ethereum.on("accountsChanged", accounts => {
            this.toastr.info(`The selected account has changed to: ${accounts[0]}`, "Account Changed", {
                timeOut: 8000
            });

            // Emit "accountChanged" event.
            this.$rootScope.$emit("web3.service.accountChanged");

        });

        // Watching for network changes.
        ethereum.on("networkChanged", () => {
            this.toastr.info("The selected network has changed. Please make sure you use the correct one", "Account Changed", {
                timeOut: 8000
            });
        });
    }

    /**
     * Returns the active account on Metamask. If
     * there isn't any it returns null.
     */
    public async getMetamaskAccountOrNull(){
        let accounts = await this.web3.eth.getAccounts();
        if (accounts.length > 0)
            return accounts[0]
        else
            return null;
    }

    /**
     * Returns the latest timestamp of the
     * blockchain.
     */
    public async latestTime() {
        let block = await this.web3.eth.getBlock("latest");
        return block.timestamp;
    }

    /**
     * Increases ganache time by the passed duration in seconds.
     * @param duration The duration of the time in seconds. 
     */
    public async increaseTime(duration: number) {
        const id = Date.now();

        return new Promise((resolve, reject) => {
            this.web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [duration],
                id: id,
            }, err1 => {
                if (err1) return reject(err1);

                this.web3.currentProvider.send({
                    jsonrpc: "2.0",
                    method: "evm_mine",
                    id: id + 1,
                }, (err2, res) => {
                    return err2 ? reject(err2) : resolve(res);
                });
            });
        });
    }

    /**
     * Returns the given ether value to wei.
     * @param amount The value in ether.
     */
    public toWei(amount: number): number {
        return new this.web3.utils.BN(this.web3.utils.toWei(amount.toString(), "ether"));
    }

    /**
     * Returns the given wei value to ether.
     * @param amount The value in wei.
     */
    public toEther(amount: number | string): number {
        return this.web3.utils.fromWei(amount.toString(), "ether");
    }

}