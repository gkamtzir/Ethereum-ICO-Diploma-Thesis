import IWeb3Service from "../../interfaces/services/web3.interface";
import IOfferDetails from "../../interfaces/components/utilities-info/offer-details.interface";
import IRentDetails from "../../interfaces/components/utilities-info/rent-details.interface";

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
        leasedTo: null,
        leasedTimestamp: null,
        endTimestamp: null
    };
    public rentedDetails: IRentDetails = {
        numberOfTokens: null,
        availableTokens: null,
        leasedFrom: null,
        endTimestamp: null
    };
    public commitDetails = {
        fromBalance: null,
        fromRented: null
    };

    // Private variables.
    private power: any;

    // Event listeners.
    private accountChangedListener: any;
    private offerChangedListener: any;
    private rentChangedListener: any;
    private commitChangedListener: any;

    constructor(
        public $scope: ng.IScope,
        public $rootScope: ng.IRootScopeService,
        public web3Service: IWeb3Service
    ) {
        this.hideLoader = false;

        // Listening for 'accountChanged' events.
        this.accountChangedListener = this.$rootScope.$on("web3.service.accountChanged", async () => {
            this.hideLoader = false;
            
            this.account = await this.web3Service.getMetamaskAccountOrNull();
            await this.getOfferDetails();
            await this.getRentDetails();
            await this.getCommitDetails();
            
            this.hideLoader = true;
            this.$scope.$apply();
        });

        // Listening for 'offerChanged' events.
        this.offerChangedListener = this.$rootScope.$on("utilities.component.offerChanged", async () => {
            await this.getOfferDetails();
            this.$scope.$apply();
        });

        // Listening for 'rentChanged' events.
        this.rentChangedListener = this.$rootScope.$on("utilities.component.rentChanged", async () => {
            await this.getRentDetails();
            this.$scope.$apply();
        });

        // Listening for 'commitChanged' events.
        this.commitChangedListener = this.$rootScope.$on("utilities.component.commitChanged", async () => {
            await this.getCommitDetails();
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
        await this.getRentDetails();
        await this.getCommitDetails();

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

        let leasedTimestamp = await this.tokenContract.methods.getOfferLeasedTimestamp(this.account).call({ from: this.account });
        if (leasedTimestamp.toString() !== '0') {
            this.offerDetails.leasedTimestamp = new Date(parseInt(leasedTimestamp) * 1000);
            this.offerDetails.endTimestamp = new Date(parseInt(leasedTimestamp) * 1000 + parseInt(this.offerDetails.duration) * 1000);
        } else {
            this.offerDetails.leasedTimestamp = null;
            this.offerDetails.endTimestamp = null;
        }
    }

    /**
     * Retrieves connected user's rent details.
     */
    private async getRentDetails() {
        this.rentedDetails.numberOfTokens = new BigNumber(await this.tokenContract.methods.getRentedNumberOfTokens(this.account).call({ from: this.account }));
        this.rentedDetails.numberOfTokens = this.rentedDetails.numberOfTokens.div(this.power).toFixed();

        this.rentedDetails.availableTokens = new BigNumber(await this.tokenContract.methods.getRentedAvailableTokens(this.account).call({ from: this.account }));
        this.rentedDetails.availableTokens = this.rentedDetails.availableTokens.div(this.power).toFixed();
    
        this.rentedDetails.leasedFrom = await this.tokenContract.methods.getRentedFrom(this.account).call({ from: this.account });

        let duration = await this.tokenContract.methods.getOfferDuration(this.rentedDetails.leasedFrom).call({ from: this.account });
        let leasedTimestamp = await this.tokenContract.methods.getOfferLeasedTimestamp(this.rentedDetails.leasedFrom).call({ from: this.account });

        if (leasedTimestamp.toString() !== '0')
            this.rentedDetails.endTimestamp = new Date(parseInt(leasedTimestamp) * 1000 + parseInt(duration) * 1000);
        else
            this.rentedDetails.endTimestamp = null;
    }

    /**
     * Retrieves the commit details.
     */
    private async getCommitDetails() {
        let commitedFromBalance = new BigNumber(await this.tokenContract.methods.getCommitedFromBalance().call({ from: this.account }));
        let commitedFromRented = new BigNumber(await this.tokenContract.methods.getCommitedFromRented().call({ from: this.account }));

        this.commitDetails.fromBalance = commitedFromBalance.div(this.power).toFixed();
        this.commitDetails.fromRented = commitedFromRented.div(this.power).toFixed();
    }

    $onDestroy(){
        this.accountChangedListener();
        this.offerChangedListener();
        this.rentChangedListener();
        this.commitChangedListener();
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
                <div class="row">
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
                                    {{ $ctrl.offerDetails.numberOfTokens != null ?  ($ctrl.offerDetails.numberOfTokens | dotSeparatorFilter ) : '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Price (in ether):
                                <span class="details-value">
                                    {{ $ctrl.offerDetails.price != null ?  ($ctrl.offerDetails.price | dotSeparatorFilter) : '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Duration (in seconds):
                                <span class="details-value">
                                    {{ $ctrl.offerDetails.duration != null ?  ($ctrl.offerDetails.duration | dotSeparatorFilter) : '-' }}
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
                        <div class="row">
                            <div class="col-sm">
                                Leased Timestamp:
                                <span class="details-value">
                                    {{ $ctrl.offerDetails.leasedTimestamp != null ? ($ctrl.offerDetails.leasedTimestamp  | date: 'medium') : '-'  }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Offer ends at:
                                <span class="details-value">
                                    {{ $ctrl.offerDetails.endTimestamp != null ? ($ctrl.offerDetails.endTimestamp  | date: 'medium') : '-'  }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm">
                        <div class="row row-title">
                            <div class="col-sm">
                                Rented Offer
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Number of Tokens:
                                <span class="details-value">
                                    {{ $ctrl.rentedDetails.numberOfTokens != null ?  ($ctrl.rentedDetails.numberOfTokens | dotSeparatorFilter) : '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Available Tokens:
                                <span class="details-value">
                                    {{ $ctrl.rentedDetails.availableTokens != null ?  ($ctrl.rentedDetails.availableTokens | dotSeparatorFilter) : '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Leased From:
                                <span class="details-value">
                                    {{ $ctrl.rentedDetails.leasedFrom != null ?  $ctrl.rentedDetails.leasedFrom : '-' }}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Leasing ends at:
                                <span class="details-value">
                                    {{ $ctrl.rentedDetails.endTimestamp != null ? ($ctrl.rentedDetails.endTimestamp  | date: 'medium') : '-'  }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-sm">
                        <div class="row row-title">
                            <div class="col-sm">
                                Commit Info
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Committed from balance:
                                <span class="details-value">
                                    {{ $ctrl.commitDetails.fromBalance | dotSeparatorFilter}}
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm">
                                Committed from rented:
                                <span class="details-value">
                                    {{ $ctrl.commitDetails.fromRented | dotSeparatorFilter}}
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