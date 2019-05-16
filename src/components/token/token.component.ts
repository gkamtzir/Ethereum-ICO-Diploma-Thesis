import IWeb3Service from "../../interfaces/services/web3.interface";

// Enumerations.
import { Status } from "../../enumerations/ContractStatus";

const { BigNumber } = require("bignumber.js");

class TokenController implements ng.IComponentController {

    public static $inject = ["$scope", "web3Service"];

    // Public variables.
    public tokenContract: any;
    public status: any;
    public tokenDetails = {
        name: null,
        symbol: null,
        totalSupply: null,
        decimals: null,
        status: null
    };

    constructor(
        public $scope: ng.IScope,
        public web3Service: IWeb3Service
    ) {}

    async $onInit() {
        this.status = Status;

        this.tokenContract = this.web3Service.tokenContract;

        this.tokenDetails.name = await this.tokenContract.methods.getName().call();
        this.tokenDetails.symbol = await this.tokenContract.methods.getSymbol().call();
        this.tokenDetails.decimals = await this.tokenContract.methods.getDecimals().call();

        this.tokenDetails.totalSupply = await this.tokenContract.methods.totalSupply().call();
        this.tokenDetails.totalSupply = new BigNumber(this.tokenDetails.totalSupply);
        this.tokenDetails.totalSupply = this.tokenDetails.totalSupply.dividedBy((new BigNumber(10)).pow(this.tokenDetails.decimals));
        this.tokenDetails.totalSupply = this.tokenDetails.totalSupply.toString();

        this.tokenDetails.status = await this.tokenContract.methods.getStatus().call();

        this.$scope.$apply();
    }

}

export default class TokenComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = TokenController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="token-component">
            <h4>OpenHouse Token</h4>
            <div class="details-card">
                <div class="row">
                    <div class="col-sm">
                        Name:
                        <span class="details-value">
                            {{ $ctrl.tokenDetails.name }}
                        </span>
                    </div>
                    <div class="col-sm">
                        Symbol:
                        <span class="details-value">
                            {{ $ctrl.tokenDetails.symbol }}
                        </span>
                    </div>
                    <div class="col-sm">
                        Total Supply:
                        <span class="details-value">
                            {{ $ctrl.tokenDetails.totalSupply | dotSeparatorFilter}}
                        </span>
                    </div>
                    <div class="col-sm">
                        Decimals:
                        <span class="details-value">
                            {{ $ctrl.tokenDetails.decimals }}
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        Status:
                        <span class="details-value">
                            <span ng-if="$ctrl.tokenDetails.status == $ctrl.status.Activated">Activated</span>
                            <span ng-if="$ctrl.tokenDetails.status == $ctrl.status.Deactivated">Deactivated</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}