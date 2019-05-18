import IWeb3Service from "../../interfaces/services/web3.interface";

const { BigNumber } = require("bignumber.js");

class UtilitiesController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service", "$rootScope", "$scope", "toastr"];

    // Public variables.
    public tokenContract: any;
    public account: string;

    public commitTokens: number;
    public commitTokensRadio: string;

    public withdrawTokens: number;
    public withdrawTokensRadio: string;

    public createOfferTokens: number;
    public createOfferPrice: number;
    public createOfferDuration: number;

    public leaseFromAddress: string;

    // Private variables.
    private power: any;

    constructor(
        public web3Service: IWeb3Service,
        public $rootScope: ng.IRootScopeService,
        public $scope: ng.IScope,
        public toastr: ng.toastr.IToastrService
    ) {
    }

    async $onInit() {
        let decimals = await this.tokenContract.methods.getDecimals().call();
        this.power = new BigNumber(10);
        this.power = this.power.pow(decimals);

        this.commitTokensRadio = "balance";
        this.withdrawTokensRadio = "balance";

        this.$scope.$apply();
    }

}

export default class UtilitiesComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {
            tokenContract: "<",
            account: "<"
        };
        this.controller = UtilitiesController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="utilities-component details-card">
            <h4>Utilities</h4>

            <hr />

            <div class="">

                <div class="category-title">Commit</div>
                <br />
                <div class="form-group">
                    <label for="commitTokens">
                        Number of Tokens
                    </label>
                    <input type="number" class="form-control" id="commitTokens" ng-model="$ctrl.commitTokens" placeholder="Enter Tokens">
                </div>

                <div class="form-group">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="commit" id="balance" value="balance" ng-model="$ctrl.commitTokensRadio" checked>
                        <label class="form-check-label" for="balance">
                            From Balance
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="commit" id="rented" value="rented" ng-model="$ctrl.commitTokensRadio">
                        <label class="form-check-label" for="rented">
                            From Rented
                        </label>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.commit()">Commit</button>

            </div>

            <hr />

            <div class="">

                <div class="category-title">Withdraw</div>
                <br />
                <div class="form-group">
                    <label for="withdrawTokens">
                        Number of Tokens
                    </label>
                    <input type="number" class="form-control" id="withdrawTokens" ng-model="$ctrl.withdrawTokens" placeholder="Enter Tokens">
                </div>

                <div class="form-group">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="withdraw" id="balance" value="balance" ng-model="$ctrl.withdrawTokensRadio" checked>
                        <label class="form-check-label" for="balance">
                            From Balance
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="withdraw" id="rented" value="rented" ng-model="$ctrl.withdrawTokensRadio">
                        <label class="form-check-label" for="rented">
                            From Rented
                        </label>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.withdraw()">Withdraw</button>

            </div>

            <hr />

            <div class="">

                <div class="category-title">Create Offer</div>
                <br />
                <div class="form-group">
                    <label for="createOfferTokens">
                        Number of Tokens
                    </label>
                    <input type="number" class="form-control" id="createOfferTokens" ng-model="$ctrl.createOfferTokens" placeholder="Enter Tokens">
                </div>

                <div class="form-group">
                    <label for="createOfferPrice">
                        Price (in ether)
                    </label>
                    <input type="number" class="form-control" id="createOfferPrice" ng-model="$ctrl.createOfferPrice" placeholder="Enter Price">
                </div>

                <div class="form-group">
                    <label for="createOfferDuration">
                        Duration (in blocks)
                    </label>
                    <input type="number" class="form-control" id="createOfferDuration" ng-model="$ctrl.createOfferDuration" placeholder="Enter Duration">
                </div>

                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.createOffer()">Create</button>

            </div>

            <hr />

            <div class="form-group row">
                <label for="removeOffer" class="col-sm-4 col-form-label">Remove Offer</label>
                <button type="submit" class="btn btn-primary sm-4 action-button no-input-button" ng-click="$ctrl.removeOffer()">Remove</button>
            </div>

            <hr />

            <div class="">

                <div class="category-title">Lease From</div>
                <br />
                <div class="form-group">
                    <label for="leaseFromAddress">
                        From
                    </label>
                    <input type="text" class="form-control" id="leaseFromAddress" ng-model="$ctrl.leaseFromAddress" placeholder="Enter Address">
                </div>

                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.leaseFrom()">Lease</button>

            </div>

            <hr />

            <div class="form-group row">
                <label for="terminateLeasing" class="col-sm-4 col-form-label">Terminate Leasing</label>
                <button type="submit" class="btn btn-primary sm-4 no-input-button" ng-click="$ctrl.terminateLeasing()">Terminate Leasing</button>
            </div>

        </div>
    `;
    }
}