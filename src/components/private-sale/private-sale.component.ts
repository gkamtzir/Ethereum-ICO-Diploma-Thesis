import IWeb3Service from "../../interfaces/services/web3.interface";

class PrivateSaleController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service", "$scope", "$rootScope"];

    // Public variables.
    public privateSaleContract: any;
    public account: string;

    // Event listeners.
    private accountChangedListener: any;

    constructor(
        private web3Service: IWeb3Service,
        private $scope: ng.IScope,
        private $rootScope: ng.IRootScopeService
    ) {
        // Listening for 'accountChanged' events.
        this.accountChangedListener = this.$rootScope.$on("web3.service.accountChanged", async () => {
            this.account = await this.web3Service.getMetamaskAccountOrNull();
            this.$scope.$apply();
        });
    }

    async $onInit() {
        this.privateSaleContract = this.web3Service.privateSaleContract;
        this.account = await this.web3Service.getMetamaskAccountOrNull();
    }

    $onDestroy() {
        // Making sure we unbind the $rootScope listeners.
        this.accountChangedListener();
    }
}

export default class PrivateSaleComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = PrivateSaleController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="private-sale-component">
            <details-component sale-contract="$ctrl.privateSaleContract" account="$ctrl.account" restricted="true"></details-component>
            <time-component></time-component>
            <div class="row">
                <div class="col-sm">
                    <basic-actions-component sale-contract="$ctrl.privateSaleContract" account="$ctrl.account"></basic-actions-component>
                </div>
                <div class="col-sm">
                    <owner-actions-component sale-contract="$ctrl.privateSaleContract" account="$ctrl.account" restricted="true"></owner-actions-component>
                </div>
            </div>
        </div>
    `;
    }
}