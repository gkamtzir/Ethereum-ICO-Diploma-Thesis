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
        private web3Service: IWeb3Service,
        private $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private toastr: ng.toastr.IToastrService
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

    /**
     * Commits an certain amount of tokens either from balance or from rented.
     */
    public async commit() {
        try {
            let supply = new BigNumber(this.commitTokens);
            supply = supply.times(this.power);

            if (this.commitTokensRadio === "balance") {
                await this.tokenContract.methods.commitFromBalance(supply.toFixed()).send({ from: this.account });
                
                this.$rootScope.$emit("utilities.component.commitChanged");

                this.toastr.success("Tokens commited successfully from balance", "Commited");
            } else if (this.commitTokensRadio === "rented") {
                await this.tokenContract.methods.commitFromRented(supply.toFixed()).send({ from: this.account });
                
                this.$rootScope.$emit("utilities.component.rentChanged");
                this.$rootScope.$emit("utilities.component.commitChanged");

                this.toastr.success("Tokens commited successfully from rented", "Commited");
            } else {
                this.toastr.error("You must either choose 'From Balance' or 'From Rented'", "Error");
            }
        } catch (exception) {
            this.toastr.error("Please make sure of the following: 1) The contract is activated, 2) You have available tokens", "Error");
        }
    }

    /**
     * Withdraws an certain amount of tokens back to rented or balance.
     */
    public async withdraw() {
        try {
            let supply = new BigNumber(this.withdrawTokens);
            supply = supply.times(this.power);

            if (this.withdrawTokensRadio === "balance") {
                await this.tokenContract.methods.commitToBalance(supply.toFixed()).send({ from: this.account });
                
                this.$rootScope.$emit("utilities.component.commitChanged");
                
                this.toastr.success("Tokens withdrawn successfully from balance", "Withdrawn");
            } else if (this.withdrawTokensRadio === "rented") {
                await this.tokenContract.methods.commitToRented(supply.toFixed()).send({ from: this.account });
                
                this.$rootScope.$emit("utilities.component.rentChanged");
                this.$rootScope.$emit("utilities.component.commitChanged");
                
                this.toastr.success("Tokens withdrawn successfully from rented", "Withdrawn");
            } else {
                this.toastr.error("You must either choose 'From Balance' or 'From Rented'", "Error");
            }
        } catch (exception) {
            this.toastr.error("Please make sure of the following: 1) The contract is activated, 2) You have commited some tokens", "Error");
        }
    }

    /**
     * Creates a token offer.
     */
    public async createOffer() {
        try {
            let supply = new BigNumber(this.createOfferTokens);
            supply = supply.times(this.power);

            let price = new BigNumber(this.createOfferPrice);
            price = price.times(this.power);

            await this.tokenContract.methods.createOffer(supply.toFixed(), price.toFixed(), this.createOfferDuration).send({ from: this.account });

            this.$rootScope.$emit("utilities.component.offerChanged");
            this.toastr.success("Offer has been successfully created", "Created");

        } catch (exception) {
            this.toastr.error(`Please make sure of the following: 1) The contract is activated, 2) Inputs are valid,
                3) You have available tokens, 4) There is not any other offer in progress, 5) The duration is set to
                at least 1 hour (3600 blocks)`, "Error");
        }
    }

    /**
     * Removes an existing non-activated offer.
     */
    public async removeOffer() {
        try {
            await this.tokenContract.methods.removeOffer().send({ from: this.account });

            this.$rootScope.$emit("utilities.component.offerChanged");
            this.toastr.success("The offer has been successfully removed", "Removed");
        } catch (exception) {
            this.toastr.error(`Please make sure of the following: 1) The contract is activated, 2) The offer is not activated`, "Error");
        }
    }

    /**
     * Leases an existing offer.
     */
    public async leaseFrom() {
        try {
            let cost = await this.tokenContract.methods.getOfferPrice(this.leaseFromAddress).call({ from: this.account });

            await this.tokenContract.methods.leaseFrom(this.leaseFromAddress).send({ from: this.account, value: cost });

            this.$rootScope.$emit("utilities.component.rentChanged");
            this.toastr.success("You have successfully leased from " + this.leaseFromAddress, "Leased");
        } catch (exception) {
            this.toastr.error(`Please make sure of the following: 1) The contract is activated, 2) The offer is not activated,
                3) You are not already leasing from someone else, 4) You have sufficient funds`, "Error");
        }
    }

    /**
     * Terminates the leasing process.
     */
    public async terminateLeasing() {
        try {
            await this.tokenContract.methods.terminateLeasing().send({ from: this.account });

            this.$rootScope.$emit("utilities.component.offerChanged");
            this.$rootScope.$emit("utilities.component.commitChanged");

            this.toastr.success("You have successfully terminated the leasing", "Terminated");
        } catch (exception) {
            this.toastr.error(`Please make sure of the following: 1) The contract is activated, 2) The offer is activated,
                3) The offer has ended`, "Error");
        }
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
                        Duration (in seconds)
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

                <button type="submit" class="btn btn-primary sm-4 action-button inline-button" ng-click="$ctrl.leaseFrom()">Lease</button>

                <rent-modal-component class="inline-button"></rent-modal-component>

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