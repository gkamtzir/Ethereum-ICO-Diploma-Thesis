import IWeb3Service from "../../services/web3.service";

const { BigNumber } = require("bignumber.js");

// Interfaces.
import IAnalyticsService from "../analytics/interfaces/analytics.interface";
import IRent from "../analytics/interfaces/rent.interface";

class RentModalController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["toastr", "analyticsService", "web3Service"];

    public rentData: IRent[];

    constructor(
        private toastr: ng.toastr.IToastrService,
        private analyticsService: IAnalyticsService,
        private web3Service: IWeb3Service
    ) {
    }

    async $onInit() {
        try {
            let response = await this.analyticsService.getOpenRents();
            this.rentData = [];

            let decimals = await this.web3Service.tokenContract.methods.getDecimals.call().call();

            let power = new BigNumber(10);
            power = power.pow(decimals);

            response.data.forEach((rent: IRent) => {
                rent.price = this.web3Service.toEther(rent.price).toString();
                rent.duration = (parseInt(rent.duration) / 3600).toString();
                
                let tokens = new BigNumber(rent.numberOfTokens);
                rent.numberOfTokens = tokens.div(power).toString();

                this.rentData.push(rent);
            });
        } catch (exception) {
            this.toastr.error(`Could not retrieve rent data. Please try again later.`, "Error");
        }
    }

}

export default class RentModalComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = RentModalController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="rent-modal-component">

            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModal">
                See Rentals
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Rentals</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="details-card" ng-repeat="rent in $ctrl.rentData track by rent.from">
                                <div class="rent-prop">
                                    <b>From</b>: {{ rent.from }}
                                </div>
                                <div class="rent-prop">
                                    <b>Number of Tokens</b>: {{ rent.numberOfTokens }}
                                </div>
                                <div class="rent-prop">
                                    <b>Price</b>: {{ rent.price }} ether
                                </div>
                                <div class="rent-prop">
                                    <b>Duration</b>: {{ rent.duration }} hour(s)
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    `;
    }
}