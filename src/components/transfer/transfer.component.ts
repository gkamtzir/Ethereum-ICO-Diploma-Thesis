import IWeb3Service from "../../interfaces/services/web3.interface";

const { BigNumber } = require("bignumber.js");

class TransferController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service", "$rootScope", "toastr"];

    // Public variables.
    public tokenContract: any;
    public account: string;

    public transferTokens: number;
    public transferTokensAddress: string;

    public transferTokensFrom: number;
    public transferTokensAddressFrom: string;
    public trasnferTokensAddressTo: string;

    public approveTokens: number;
    public approveTokensAddress: string;

    // Private variables.
    private power: any;

    constructor(
        private web3Service: IWeb3Service,
        private $rootScope: ng.IRootScopeService,
        private toastr: ng.toastr.IToastrService
    ) {
    }

    async $onInit() {
        let decimals = await this.tokenContract.methods.getDecimals().call();
        this.power = new BigNumber(10);
        this.power = this.power.pow(decimals);
    }

    /**
     * Transfers tokens from the connected account to
     * another.
     */
    public async transfer() {
        try {
            let tokenSupply = new BigNumber(this.transferTokens);
            tokenSupply = tokenSupply.times(this.power);

            await this.tokenContract.methods.transfer(this.transferTokensAddress, tokenSupply.toFixed()).send({ from: this.account });

            this.toastr.success("You have successfully transfered tokens", "Transfered");
        } catch (exception) {
            this.toastr.error("Please make sure of the following: 1) The contract is activated, 2)You have tokens available, 3) The address is valid", "Error");
        }
    }

    /**
     * Transfers tokens from one account to another.
     */
    public async transferFrom() {
        try {
            let tokenSupply = new BigNumber(this.transferTokensFrom);
            tokenSupply = tokenSupply.times(this.power);

            await this.tokenContract.methods.transferFrom(this.transferTokensAddressFrom, this.trasnferTokensAddressTo, tokenSupply.toFixed())
                .send({ from: this.account });

            this.toastr.success("You have successfully transfered tokens", "Transfered");
        } catch (exception) {
            this.toastr.error(`Please make sure of the following: 1) The contract is activated, 2) You have approved tokens, 
                3) The address from which you are sending tokens has tokens available, 4) The addresses are valid`, "Error");
        }
    }

    /**
     * Approves the spending of an amount of tokens to an address.
     */
    public async approve() {
        try {
            let tokenSupply = new BigNumber(this.approveTokens);
            tokenSupply = tokenSupply.times(this.power);

            await this.tokenContract.methods.approve(this.approveTokensAddress, tokenSupply.toFixed()).send({ from: this.account });
            
            this.toastr.success("You have successfully approved tokens", "Approve");
        } catch (exception) {
            this.toastr.error("Please make sure of the following: 1) The contract is activated, 2) The address is valid", "Error");
        }
    }

}

export default class TransferComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {
            tokenContract: "<",
            account: "<"
        };
        this.controller = TransferController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="transfer-component details-card">
            <h4>Transfer actions</h4>

            <hr />

            <div class="">

                <div class="category-title">Transfer Tokens</div>
                <br />
                <div class="form-group">
                    <label for="transferTokens">
                        Number of Tokens
                    </label>
                    <input type="number" class="form-control" id="transferTokens" ng-model="$ctrl.transferTokens" placeholder="Enter Tokens">
                </div>

                <div class="form-group">
                    <label for="transferTokensAddress">
                        To
                    </label>
                    <input type="text" class="form-control" id="transferTokensAddress" ng-model="$ctrl.transferTokensAddress" placeholder="Enter Address">
                </div>

                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.transfer()">Transfer</button>

            </div>

            <hr />

            <div class="">
            
                <div class="category-title">Transfer Tokens From</div>
                <br />
                <div class="form-group">
                    <label for="transferTokensFrom">
                        Number of Tokens
                    </label>
                    <input type="number" class="form-control" id="transferTokensFrom" ng-model="$ctrl.transferTokensFrom" placeholder="Enter Tokens">
                </div>

                <div class="form-group">
                    <label for="transferTokensAddressFrom">
                        From
                    </label>
                    <input type="text" class="form-control" id="transferTokensAddressFrom" ng-model="$ctrl.transferTokensAddressFrom" placeholder="Enter Address">
                </div>

                <div class="form-group">
                    <label for="trasnferTokensAddressTo">
                        To
                    </label>
                    <input type="text" class="form-control" id="trasnferTokensAddressTo" ng-model="$ctrl.trasnferTokensAddressTo" placeholder="Enter Address">
                </div>

                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.transferFrom()">Transfer</button>

            </div>

            <hr />

            <div class="">

                <div class="category-title">Approve Tokens</div>
                <br />
                <div class="form-group">
                    <label for="approveTokens">
                        Number of Tokens
                    </label>
                    <input type="number" class="form-control" id="approveTokens" ng-model="$ctrl.approveTokens" placeholder="Enter Tokens">
                </div>

                <div class="form-group">
                    <label for="approveTokensAddress">
                        To
                    </label>
                    <input type="text" class="form-control" id="approveTokensAddress" ng-model="$ctrl.approveTokensAddress" placeholder="Enter Address">
                </div>

                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.approve()">Approve</button>

            </div>

        </div>
    `;
    }
}