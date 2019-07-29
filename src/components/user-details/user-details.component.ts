import IUserDetails from "../../interfaces/components/details/user.interface";
import IWeb3Service from "../../interfaces/services/web3.interface";

class UserDetailsController implements ng.IComponentController {

    // Component's injectables.
    public static $inject = ["$scope", "$rootScope", "web3Service"];
    
    // Public variables.
    public saleContract: any;
    public restricted: boolean;
    public account: string;

    // Event listeners.
    private tokensBoughtListener: any;

    public userDetails: IUserDetails = {
        allowance: false,
        tokensBought: 0
    };

    constructor(
        private $scope: ng.IScope,
        private $rootScope: ng.IRootScopeService,
        private web3Service: IWeb3Service
    ) 
    {
        // Listening for 'boughtTokens' events.
        this.tokensBoughtListener = this.$rootScope.$on("basic-actions.component.tokensBought", async () => {
            this.userDetails.tokensBought = await this.saleContract.methods.getBalanceOf(this.account).call();
            this.$scope.$apply();
        });
    }

    async $onChanges(changes: any) {
        // When the address changes we update the allowance field.
        if (changes.account != null && changes.account.currentValue != null){
            if (this.restricted)
                this.userDetails.allowance = await this.saleContract.methods.getAddressAllowance(changes.account.currentValue).call();
            this.userDetails.tokensBought = await this.saleContract.methods.getBalanceOf(changes.account.currentValue).call();
            this.$scope.$apply();
        }
    }

    $onDestroy() {
        // Make sure we unbind the $rootScope listeners.
        this.tokensBoughtListener();
    }
}

export default class UserDetailsComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {
            "saleContract": "<",
            "account": "<",
            "restricted": "<"
        };
        this.controller = UserDetailsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="user-details-component">
                <div class="user-title">
                    User details (based on Metamask)
                </div>
                <br />
                <div class="row">
                    <div class="col-sm">
                        Address:
                        <span class="details-value">
                            {{ $ctrl.account }}
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md">
                        Tokens Bought:
                        <span class="details-value">
                            {{ $ctrl.userDetails.tokensBought }}
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm" ng-if="$ctrl.restricted">
                        Allowed:
                        <span class="details-value">
                            {{ $ctrl.userDetails.allowance }}
                        </span>
                    </div>
                </div>
        </div>
    `;
    }
}