class NavbarController implements ng.IComponentController {
    public activeTab: string;

    constructor() {
        this.activeTab = "#/privateSale";
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
                    <a class="nav-link" ng-class="{active: $ctrl.activeTab === '#/privateSale'}"
                        ng-click="$ctrl.activeTab = '#/privateSale'" href="/#/privateSale">
                            Private Sale
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" ng-class="{active: $ctrl.activeTab === '#/preICOSale'}"
                        ng-click="$ctrl.activeTab = '#/preICOSale'" href="/#/preICOSale">
                            Pre ICO Sale
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" ng-class="{active: $ctrl.activeTab === '#/ICOSale'}"
                        ng-click="$ctrl.activeTab = '#/ICOSale'" href="/#/ICOSale">
                            ICO Sale
                    </a>
                </li>
            </ul>
        </div>
    `;
    }
}