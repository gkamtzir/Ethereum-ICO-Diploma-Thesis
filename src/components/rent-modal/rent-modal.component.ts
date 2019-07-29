import IAnalyticsService from "../analytics/interfaces/analytics.interface";
import IRent from "../analytics/interfaces/rent.interface";

class RentModalController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["toastr", "analyticsService"];

    public rentData: IRent[];

    constructor(
        private toastr: ng.toastr.IToastrService,
        private analyticsService: IAnalyticsService
    ) {
    }

    async $onInit() {
        try {
            let response = await this.analyticsService.getRents();
            this.rentData = response.data;
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
                                    <b>Price</b>: {{ rent.price }}
                                </div>
                                <div class="rent-prop">
                                    <b>Duration</b>: {{ rent.duration }}
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