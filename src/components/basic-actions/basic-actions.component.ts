class BasicActionsController implements ng.IComponentController {

    constructor() {}
}

export default class BasicActionsComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = BasicActionsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="basic-actions-component">
            <h4>Basic actions</h4>
            
            <div class="form-group row">
                <label for="buyTokens" class="col-sm-4 col-form-label">Buy Tokens:</label>
                <div class="col-sm-4">
                    <input type="number" class="form-control" id="buyTokens" placeholder="Enter Tokens">
                </div>
                <button type="submit" class="btn btn-primary sm-4 action-button">Buy</button>
            </div>

            <div class="form-group row">
                <label for="refundTokens" class="col-sm-4 col-form-label">Refund Tokens</label>
                <button type="submit" class="btn btn-primary sm-4 action-button no-input-button">Refund</button>
            </div>

            <div class="form-group row">
                <label for="redeemTokens" class="col-sm-4 col-form-label">Redeem Tokens</label>
                <button type="submit" class="btn btn-primary sm-4 action-button no-input-button">Redeem</button>
            </div>
        </div>
    `;
    }
}