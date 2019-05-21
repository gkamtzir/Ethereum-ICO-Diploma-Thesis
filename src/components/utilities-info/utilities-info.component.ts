import IWeb3Service from "../../interfaces/services/web3.interface";

const { BigNumber } = require("bignumber.js");

class UtilitiesInfoController implements ng.IComponentController {

    public static $inject = ["$scope", "$rootScope", "web3Service"];

    // Public variables.
    public tokenContract: any;
    public account: string;

    // Event listeners.
    private accountChangedListener: any;

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
    }

    async $onInit() {
        this.tokenContract = this.web3Service.tokenContract;
        this.account = await this.web3Service.getMetamaskAccountOrNull();

        this.$scope.$apply();
    }

    $onDestroy(){
        this.accountChangedListener();
    }

}

export default class UtilitiesInfoComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = UtilitiesInfoController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="utilities-info-component">
            <h4>Utilities Info</h4>
            <div class="details-card">
                
            </div>
        </div>
    `;
    }
}