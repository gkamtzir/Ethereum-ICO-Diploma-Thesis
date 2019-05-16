import IWeb3Service from "../../interfaces/services/web3.interface";

class TransferController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service", "$rootScope", "toastr"];

    // Public variables.
    public tokenContract: any;
    public account: string;

    constructor(
        public web3Service: IWeb3Service,
        public $rootScope: ng.IRootScopeService,
        public toastr: ng.toastr.IToastrService
    ) {
    }

    async $onInit() {
    }

}

export default class TransferComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {
            tokenContract: "<",
            account: "<"
        };
        this.controller = TransferController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="transfer-component">
            <h4>Transfer actions</h4>

            <hr />

            <div class="">
                <div class="category-title">Transfer Tokens</div>
                <br />
                <div class="form-group">
                    <label for="transferTokens">
                        Number of Tokens
                    </label>
                    <input type="number" class="form-control" id="transferTokens" ng-model="" placeholder="Enter Tokens">
                </div>

                <div class="form-group">
                    <label for="transferTo">
                        To
                    </label>
                    <input type="text" class="form-control" id="transferTo" ng-model="" placeholder="Enter Address">
                </div>

                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="">Transfer</button>

            </div>

            <hr />

        </div>
    `;
    }
}