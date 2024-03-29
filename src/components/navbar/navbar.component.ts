class NavbarController implements ng.IComponentController {
    
    // Controller's injectables.
    public static $inject = ["$location"]; 
    
    // Public variables.
    public activeTab: string;

    constructor(
        private $location: ng.ILocationService
    ) {
        this.updateActiveTab();
    }

    /**
     * Checks for the current url path and
     * updates the activeTab variable.
     */
    public updateActiveTab(tab?: string): void {
        if (tab != null)
            this.activeTab = tab;
        else
            this.activeTab = this.$location.path();
    }
}

export default class NavbarComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = NavbarController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="navbar-component">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link" ng-class="{active: $ctrl.activeTab === '/' || $ctrl.activeTab === ''}"
                        ng-click="$ctrl.updateActiveTab('/')" href="#/">
                            OpenHouse Token
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" ng-class="{active: $ctrl.activeTab === '/privateSale' || $ctrl.activeTab === ''}"
                        ng-click="$ctrl.updateActiveTab('/privateSale')" href="#/privateSale">
                            Private Sale
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" ng-class="{active: $ctrl.activeTab === '/preICOSale'}"
                        ng-click="$ctrl.updateActiveTab('/preICOSale')" href="#/preICOSale">
                            Pre ICO Sale
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" ng-class="{active: $ctrl.activeTab === '/ICOSale'}"
                        ng-click="$ctrl.updateActiveTab('/ICOSale')" href="#/ICOSale">
                            ICO Sale
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" ng-class="{active: $ctrl.activeTab === '/analytics'}"
                        ng-click="$ctrl.updateActiveTab('/analytics')" href="#/analytics">
                            Analytics
                    </a>
                </li>
            </ul>
        </div>
    `;
    }
}