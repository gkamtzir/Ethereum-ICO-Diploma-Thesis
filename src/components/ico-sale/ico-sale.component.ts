import IWeb3Service from "../../interfaces/services/web3.interface";

class ICOSaleController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service", "$scope", "$rootScope"];

    // Public variables.
    public ICOSaleContract: any;
    public account: string;

    // Event listeners.
    private accountChangedListener: any;

    constructor(
        public web3Service: IWeb3Service,
        public $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService
    ) {
        // Listening for 'accountChanged' events.
        this.accountChangedListener = this.$rootScope.$on("web3.service.accountChanged", async () => {
            this.account = await this.web3Service.getMetamaskAccountOrNull();
            this.$scope.$apply();
        });
    }

    async $onInit() {
        this.ICOSaleContract = this.web3Service.ICOSaleContract;
        this.account = await this.web3Service.getMetamaskAccountOrNull();
    }

    $onDestroy() {
        // Making sure we unbind the $rootScope listeners.
        this.accountChangedListener();
    }
}

export default class ICOSaleComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = ICOSaleController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="ico-sale-component">
            <details-component sale-contract="$ctrl.ICOSaleContract" account="$ctrl.account" restricted="false"></details-component>
            <time-component></time-component>
            <div class="row">
                <div class="col-sm">
                    <basic-actions-component sale-contract="$ctrl.ICOSaleContract" account="$ctrl.account" restricted="false"></basic-actions-component>
                </div>
                <div class="col-sm">
                    <owner-actions-component sale-contract="$ctrl.ICOSaleContract" account="$ctrl.account" restricted="false"></owner-actions-component>
                </div>
            </div>
        </div>
    `;
    }
}