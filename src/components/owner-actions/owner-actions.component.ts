class AdminActionsController implements ng.IComponentController {

    public static $inject = ["toastr"];

    public saleContract: any;
    public account: string;
    public restricted: boolean;

    constructor(
        public toastr: ng.toastr.IToastrService
    ) {
        this.restricted = false;
    }

    /**
     * Deactivates the sale contract.
     */
    public async deactivate() {
        try {
            await this.saleContract.methods.deactivate().send({ from: this.account });
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
        } catch (exception) {
            this.toastr.error("Only the owner can activate the contract", "Error");
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
            restricted: "<"
        };
        this.controller = AdminActionsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="admin-actions-component">
            <h4>Onwer actions</h4>

            <div class="form-group row">
                <label for="deactivate" class="col-sm-4 col-form-label">Deactivate Contract</label>
                <button type="submit" class="btn btn-danger sm-4 action-button no-input-button" ng-click="$ctrl.deactivate()">Deactivate</button>
            </div>

            <div class="form-group row">
                <label for="activate" class="col-sm-4 col-form-label">Activate Contract</label>
                <button type="submit" class="btn btn-success sm-4 action-button no-input-button" ng-click="$ctrl.activate()">Activate</button>
            </div>

            <div class="form-group row">
                <label for="reallocate" class="col-sm-4 col-form-label">Reallocate Tokens</label>
                <button type="submit" class="btn btn-primary sm-4 action-button no-input-button">Reallocate</button>
            </div>

            <div class="form-group row" ng-if="$ctrl.restricted">
                <label for="allowAddress" class="col-sm-4 col-form-label">Allow Address:</label>
                <div class="col-sm-4">
                    <input type="text" class="form-control" id="allowAddress" placeholder="Enter Address">
                </div>
                <button type="submit" class="btn btn-primary sm-4 action-button">Allow</button>
            </div>

            <div class="form-group row">
                <label for="transferOwnership" class="col-sm-4 col-form-label">Transfer Ownership:</label>
                <div class="col-sm-4">
                    <input type="text" class="form-control" id="transferOwnership" placeholder="Enter Address">
                </div>
                <button type="submit" class="btn btn-primary sm-4 action-button">Transfer</button>
            </div>
        </div>
    `;
    }
}