import IOwnerActions from "../../interfaces/components/owner-actions/owner-actions.interface";

class AdminActionsController implements ng.IComponentController, IOwnerActions {

    // Controllers's injectables.
    public static $inject = ["toastr", "$rootScope"];

    // Public variables.
    public saleContract: any;
    public account: string;
    public restricted: boolean;
    public basic: boolean;

    public addressToBeAllowed: string;
    public addressToBeOwner: string;

    constructor(
        public toastr: ng.toastr.IToastrService,
        public $rootScope: ng.IRootScopeService
    ) {
        this.restricted = false;
        this.basic = false;
    }

    /**
     * Deactivates the sale contract.
     */
    public async deactivate() {
        try {
            await this.saleContract.methods.deactivate().send({ from: this.account });
            this.toastr.success("The contract has been successfully deactivated", "Deactivated");
            this.$rootScope.$emit("owner.component.statusChanged");
        } catch (exception) {
            this.toastr.error("Only the owner can deactivate the contract", "Error");
        }

    }

    /**
     * Activates the sale contract.
     */
    public async activate() {
        try {
            await this.saleContract.methods.activate().send({ from: this.account });
            this.toastr.success("The contract has beed successfully activated", "Activated");
            this.$rootScope.$emit("owner.component.statusChanged");
        } catch (exception) {
            this.toastr.error("Only the owner can activate the contract", "Error");
        }
    }

    /**
     * Allow an address to participate in the sale.
     */
    public async allowAddress() {
        try {
            await this.saleContract.methods.allowAddress(this.addressToBeAllowed).send({ from: this.account });
            this.toastr.success("The address has been allowed to participate in the sale", "Allowed");
        } catch (exception) {
            this.toastr.error("Please make sure the contract is activated and you are the owner", "Error");
        }
    }

    /**
     * Transfers the ownership of the contract to
     * another address.
     */
    public async transferOwnership() {
        try {
            await this.saleContract.methods.transferOwnership(this.addressToBeOwner).send({ from: this.account });
            this.$rootScope.$emit("owner.component.ownerChanged");
            this.toastr.success("The ownership of the contract has been transfered successfully", "Transfered Onwership");
        } catch (exception) {
            this.toastr.error("Please make sure you are the owner", "Error");
        }
    }

    /**
     * Reallocates the remaining tokens back to the owner. If
     * the sale was successful then all the raised ether will
     * be sent back to the owner as well.
     */
    public async reallocateTokens() {

        if (this.basic)
            throw "This method is not supported for this kind of usage."

        try {
            await this.saleContract.methods.reallocateTokens().send({ from: this.account });
            this.toastr.success("The tokens have been successfully reallocated", "Success");
        } catch (exception) {
            this.toastr.error(`Please make sure of the following: 1) The contract is activated,
             2) The sale has ended, 3) You are the owner`, "Error");
        }
    }
}

export default class AdminActionsComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {
            saleContract: "<",
            account: "<",
            restricted: "<",
            basic: "<"
        };
        this.controller = AdminActionsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="admin-actions-component details-card">
            <h4>Onwer actions</h4>

            <div class="form-group row">
                <label for="deactivate" class="col-sm-4 col-form-label">Deactivate Contract</label>
                <button type="submit" class="btn btn-danger sm-4 action-button no-input-button" ng-click="$ctrl.deactivate()">Deactivate</button>
            </div>

            <div class="form-group row">
                <label for="activate" class="col-sm-4 col-form-label">Activate Contract</label>
                <button type="submit" class="btn btn-success sm-4 action-button no-input-button" ng-click="$ctrl.activate()">Activate</button>
            </div>

            <div class="form-group row" ng-if="!$ctrl.basic">
                <label for="reallocate" class="col-sm-4 col-form-label">Reallocate Tokens</label>
                <button type="submit" class="btn btn-primary sm-4 action-button no-input-button" ng-click="$ctrl.reallocateTokens()">Reallocate</button>
            </div>

            <div class="form-group row" ng-if="$ctrl.restricted">
                <label for="allowAddress" class="col-sm-4 col-form-label">Allow Address:</label>
                <div class="col-sm-4">
                    <input type="text" class="form-control" id="allowAddress" ng-model="$ctrl.addressToBeAllowed" placeholder="Enter Address">
                </div>
                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.allowAddress()">Allow</button>
            </div>

            <div class="form-group row">
                <label for="transferOwnership" class="col-sm-4 col-form-label">Transfer Ownership:</label>
                <div class="col-sm-4">
                    <input type="text" class="form-control" id="transferOwnership" ng-model="$ctrl.addressToBeOwner" placeholder="Enter Address">
                </div>
                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.transferOwnership()">Transfer</button>
            </div>
        </div>
    `;
    }
}