import IWeb3Service from "../../interfaces/services/web3.interface";

// Enumerations.
import { Status } from "../../enumerations/ContractStatus";

const { BigNumber } = require("bignumber.js");

class TokenController implements ng.IComponentController {

    public static $inject = ["$scope", "$rootScope", "web3Service"];

    // Public variables.
    public tokenContract: any;
    public account: string;
    public status: any;
    public tokenDetails = {
        name: null,
        symbol: null,
        totalSupply: null,
        decimals: null,
        status: null
    };

    // Event listeners.
    private accountChangedListener: any;
    private statusChangedListener: any;

    constructor(
        public $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        public web3Service: IWeb3Service
    ) {
        // Listening for 'accountChanged' events.
        this.accountChangedListener = this.$rootScope.$on("web3.service.accountChanged", async () => {
            this.account = await this.web3Service.getMetamaskAccountOrNull();
            this.$scope.$apply();
        });

        // Listening for 'statusChanged' events.
        this.statusChangedListener = this.$rootScope.$on("owner.component.statusChanged", async () => {
            this.tokenDetails.status = await this.tokenContract.methods.getStatus().call();
            this.$scope.$apply();
        });
    }

    async $onInit() {
        this.status = Status;

        this.tokenContract = this.web3Service.tokenContract;
        this.account = await this.web3Service.getMetamaskAccountOrNull();

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

    $onDestroy(){
        this.accountChangedListener();
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
            <div class="row">
                <div class="col-sm">
                    <transfer-component token-contract="$ctrl.tokenContract" account="$ctrl.account"></transfer-component>
                </div>
                <div class="col-sm">
                    <utilities-component token-contract="$ctrl.tokenContract" account="$ctrl.account"></utilities-component>
                </div>
            </div>
            
            <br />
            <hr />
            
            <div class="row">
                <div class="col-sm">
                    <owner-actions-component sale-contract="$ctrl.tokenContract" account="$ctrl.account" restricted="false" basic="true"></owner-actions-component>
                </div>
            </div>
        </div>
    `;
    }
}