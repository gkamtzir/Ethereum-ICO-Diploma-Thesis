class AdminActionsController implements ng.IComponentController {

    public restricted: boolean;

    constructor() {
        this.restricted = false;
    }
}

export default class AdminActionsComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {
            restricted: "<"
        };
        this.controller = AdminActionsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="admin-actions-component">
            <h4>Onwer actions</h4>

            <div class="form-group row">
                <label for="deactivate" class="col-sm-4 col-form-label">Deactivate Contract</label>
                <button type="submit" class="btn btn-danger sm-4 action-button no-input-button">Deactivate</button>
            </div>

            <div class="form-group row">
                <label for="activate" class="col-sm-4 col-form-label">Activate Contract</label>
                <button type="submit" class="btn btn-success sm-4 action-button no-input-button">Activate</button>
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