import IWeb3Service from "../../interfaces/services/web3.interface";
import IBasicActions from "../../interfaces/components/basic-actions/basic-actions.interface";

const { BigNumber } = require("bignumber.js");

class BasicActionsController implements ng.IComponentController, IBasicActions {

    // Controller's injectables.
    public static $inject = ["web3Service", "$rootScope", "toastr"];

    // Public variables.
    public saleContract: any;
    public account: string;
    public numberOfTokens: number;

    // Private variables.
    private tokenPrice: any;

    constructor(
        public web3Service: IWeb3Service,
        public $rootScope: ng.IRootScopeService,
        public toastr: ng.toastr.IToastrService
    ) {
        this.numberOfTokens = 0;
    }

    async $onInit() {
        this.tokenPrice = await this.saleContract.methods.getTokenPrice().call();
        this.tokenPrice = new BigNumber(this.tokenPrice);
    }

    /**
     * Buys tokens for the selected address.
     */
    public async buyTokens() {
        try {
            const cost = this.tokenPrice.times(this.numberOfTokens);
            await this.saleContract.methods.buyTokens(this.numberOfTokens).send({ from: this.account, value: cost})
            this.$rootScope.$emit("basic-actions.component.tokensBought");
        } catch (exception) {
            this.toastr.error(`Please make sure the contract is activated and the sale is live. 
                Also be sure that there are available tokens left.`, "Error");
        }
    }

    /**
     * Redeems user's tokens when the sale has been completed successfully
     * and the tokens are redeemable.
     */
    public async redeemTokens() {
        try {
            await this.saleContract.methods.redeemTokens().send({ from: this.account });
            this.$rootScope.$emit("basic-actions.component.tokensBought");
            this.toastr.success("Your tokens have been successfully redeemed", "Redeemed");
        } catch (exception) {
            this.toastr.error(`Please make sure of the following: 1) The contract is active, 
                2) The sale has ended, 3) You have bought tokens, 4) The tokens are redeemable`, "Error");
        }
    }

    /**
     * Refunds user's tokens when the sale has failed.
     */
    public async refundTokens() {
        try {
            await this.saleContract.methods.refundTokens().send({ from: this.account });
            this.$rootScope.$emit("basic-actions.component.tokensBought");
            this.toastr.success("Your tokens have been successfully refunded", "Refunded");
        } catch (exception) {
            this.toastr.error(`Please make sure of the following: 1) The contract is active, 
                2) The sale has ended, 3) The sale has failed, 4) You have bought tokens`, "Error");
        }
    }
}

export default class BasicActionsComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {
            saleContract: "<",
            account: "<"
        };
        this.controller = BasicActionsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="basic-actions-component">
            <h4>Basic actions</h4>

            <div class="form-group row">
                <label for="buyTokens" class="col-sm-4 col-form-label">
                    Buy Tokens:
                </label>
                <div class="col-sm-4">
                    <input type="number" class="form-control" id="buyTokens" ng-model="$ctrl.numberOfTokens" placeholder="Enter Tokens">
                </div>
                <button type="submit" class="btn btn-primary sm-4 action-button" ng-click="$ctrl.buyTokens()">Buy</button>
            </div>

            <div class="form-group row">
                <label for="refundTokens" class="col-sm-4 col-form-label">Refund Tokens</label>
                <button type="submit" class="btn btn-primary sm-4 action-button no-input-button" ng-click="$ctrl.refundTokens()">Refund</button>
            </div>

            <div class="form-group row">
                <label for="redeemTokens" class="col-sm-4 col-form-label">Redeem Tokens</label>
                <button type="submit" class="btn btn-primary sm-4 action-button no-input-button" ng-click="$ctrl.redeemTokens()">Redeem</button>
            </div>
        </div>
    `;
    }
}