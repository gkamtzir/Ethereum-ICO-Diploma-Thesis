import IWeb3Service from "../../interfaces/services/web3.interface";
import IOfferDetails from "../../interfaces/components/utilities-info/offer-details.interface";

const { BigNumber } = require("bignumber.js");

class UtilitiesInfoController implements ng.IComponentController {

    public static $inject = ["$scope", "$rootScope", "web3Service"];

    // Public variables.
    public tokenContract: any;
    public account: string;
    public hideLoader: boolean;
    public offerDetails: IOfferDetails = {
        numberOfTokens: null,
        price: null,
        duration: null,
        leasedTo: null
    };

    // Private variables.
    private power: any;

    // Event listeners.
    private accountChangedListener: any;
    private offerChangedListener: any;

    constructor(
        public $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        public web3Service: IWeb3Service
    ) {
        this.hideLoader = false;

        // Listening for 'accountChanged' events.
        this.accountChangedListener = this.$rootScope.$on("web3.service.accountChanged", async () => {
            this.account = await this.web3Service.getMetamaskAccountOrNull();
            await this.getOfferDetails();
            this.$scope.$apply();
        });

        // Listening for 'offerChanged' events.
        this.offerChangedListener = this.$rootScope.$on("utilities.component.offerChanged", async () => {
            await this.getOfferDetails();
            this.$scope.$apply();
        });
    }

    async $onInit() {
        this.tokenContract = this.web3Service.tokenContract;
        this.account = await this.web3Service.getMetamaskAccountOrNull();

        let decimals = await this.tokenContract.methods.getDecimals().call();
        this.power = new BigNumber(10);
        this.power = this.power.pow(decimals);

        await this.getOfferDetails();

        this.hideLoader = true;
        this.$scope.$apply();
    }

    /**
     * Retrieves connected user's offer details.
     */
    private async getOfferDetails() {
        this.offerDetails.numberOfTokens = new BigNumber(await this.tokenContract.methods.getOfferNumberOfTokens(this.account).call({ from: this.account }));
        this.offerDetails.numberOfTokens = this.offerDetails.numberOfTokens.div(this.power).toFixed();

        this.offerDetails.price = new BigNumber(await this.tokenContract.methods.getOfferPrice(this.account).call({ from: this.account }));
        this.offerDetails.price = this.offerDetails.price.div(this.power).toFixed();
        
        this.offerDetails.duration = await this.tokenContract.methods.getOfferDuration(this.account).call({ from: this.account });
        
        this.offerDetails.leasedTo = await this.tokenContract.methods.getOfferLeasedTo(this.account).call({ from: this.account });
    }

    $onDestroy(){
        this.accountChangedListener();
        this.offerChangedListener();
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
            <div class="loader-overlay" ng-hide="$ctrl.hideLoader">
                <div class="spin-loader"></div>
            </div>
            <h4>Utilities Info</h4>
            <div class="details-card">
                <div class="row>
                    <div class="col-sm">
                        <div class="row row-title">
                            <div class="col-sm">
                                Created Offer
                            </div>
                        </div>                        
                        <div class="row">
                            <div class="col-sm">
                                Number of Tokens:
                                <span class="details-value">
                                    {{ $ctrl.offerDetails.numberOfTokens != null ?  $ctrl.offerDetails.numberOfTokens : '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Price (in ether):
                                <span class="details-value">
                                    {{ $ctrl.offerDetails.price != null ?  $ctrl.offerDetails.price : '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Duration:
                                <span class="details-value">
                                    {{ $ctrl.offerDetails.duration != null ?  $ctrl.offerDetails.duration : '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Leased To:
                                <span class="details-value">
                                    {{ $ctrl.offerDetails.leasedTo != null ?  $ctrl.offerDetails.leasedTo : '-' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}