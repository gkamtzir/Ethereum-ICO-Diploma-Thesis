import IDetails from "../../interfaces/components/details/details.interface";

// Enumerations.
import { Status } from "../../enumerations/ContractStatus";
import IWeb3Service from "../../interfaces/services/web3.interface";

class DetailsController implements ng.IComponentController {

    // Component's injectables.
    public static $inject = ["$scope", "$rootScope", "web3Service"];
    
    // Public variables.
    public saleContract: any;
    public status: any;
    public hideLoader: boolean;

    // Event listeners.
    private statusChangedListener: any;

    public details: IDetails = {
        price: null,
        minCap: null,
        maxCap: null,
        startDate: null,
        endDate: null,
        redeemableAfterDate: null,
        owner: null,
        status: null
    };

    constructor(
        public $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        public web3Service: IWeb3Service
    ) 
    {
        this.hideLoader = false;

        // Listening for 'statusChanged' events.
        this.statusChangedListener = this.$rootScope.$on("owner.component.statusChanged", async () => {
            this.details.status = await this.saleContract.methods.getStatus().call();
            this.$scope.$apply();
        });
    }

    async $onInit() {
        this.status = Status;
        
        if (this.saleContract != null) {
            this.details.price = await this.saleContract.methods.getTokenPrice().call();
            this.details.price = this.web3Service.toEther(this.details.price);

            this.details.minCap = await this.saleContract.methods.getTokensMinCap().call();
            this.details.maxCap = await this.saleContract.methods.getTokensMaxCap().call();
            
            let startTimestamp = await this.saleContract.methods.getStartTimestamp().call();
            this.details.startDate = new Date(startTimestamp * 1000);
    
            let endTimestamp = await this.saleContract.methods.getEndTimestamp().call();
            this.details.endDate = new Date(endTimestamp * 1000);
    
            let redeemableAfterTimestamp = await this.saleContract.methods.getRedeemableAfterTimestamp().call();
            this.details.redeemableAfterDate = new Date(redeemableAfterTimestamp * 1000);
    
            this.details.owner = await this.saleContract.methods.getOwner().call();
            this.details.status = await this.saleContract.methods.getStatus().call();

            this.hideLoader = true;
            this.$scope.$apply();
        }

    }

    $onDestroy() {
        // Make sure we unbind the $rootScope listeners.
        this.statusChangedListener();
    }
}

export default class DetailsComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {
            "saleContract": "<"
        };
        this.controller = DetailsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="details-component">
            <div class="loader-overlay" ng-hide="$ctrl.hideLoader">
                <div class="spin-loader"></div>
            </div>
            <h4>Details</h4>
            <div class="details-card">
                <div class="row">
                    <div class="col-sm">
                        Price: <span class="details-value">{{ $ctrl.details.price }} (in ether)</span>
                    </div>
                    <div class="col-sm">
                        Minimum cap: <span class="details-value">{{ $ctrl.details.minCap | dotSeparatorFilter }}</span>
                    </div>
                    <div class="col-sm">
                        Maximum cap: <span class="details-value">{{ $ctrl.details.maxCap | dotSeparatorFilter}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        Start Date: <span class="details-value">{{ $ctrl.details.startDate | date: "medium" }}</span>
                    </div>
                    <div class="col-sm">
                        End Date: <span class="details-value">{{ $ctrl.details.endDate | date: "medium" }}</span>
                    </div>
                    <div class="col-sm">
                        Redeemable Date: <span class="details-value">{{ $ctrl.details.redeemableAfterDate | date: "medium" }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        Owner: <span class="details-value">{{ $ctrl.details.owner }}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        <b>Status:</b>
                        <span class="details-value">
                            <span ng-if="$ctrl.details.status == $ctrl.status.Activated">Activated</span>
                            <span ng-if="$ctrl.details.status == $ctrl.status.Deactivated">Deactivated</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}