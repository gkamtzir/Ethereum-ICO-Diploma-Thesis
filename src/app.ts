// AngularJS dependencies.
import * as angular from "angular";
import "angular-route/angular-route.min.js";
import "angular-toastr/dist/angular-toastr.tpls.min.js";

import "bignumber.js/bignumber.min.js";

// Styling dependencies.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "angular-toastr/dist/angular-toastr.min.css";

import "./app.scss";
import "./components/navbar/navbar.component.scss";
import "./components/details/details.component.scss";
import "./components/private-sale/private-sale.component.scss";
import "./components/pre-ico-sale/pre-ico-sale.component.scss";
import "./components/ico-sale/ico-sale.component.scss";
import "./components/time/time.component.scss";
import "./components/basic-actions/basic-actions.component.scss";
import "./components/owner-actions/owner-actions.component.scss";

// Application dependencies.

// Importing contract json files.
import * as OpenHouseToken from "../build/contracts/OpenHouseToken.json";
import * as PrivateSale from "../build/contracts/PrivateSale.json";

// Components.
import NavbarComponent from "./components/navbar/navbar.component";
import DetailsComponent from "./components/details/details.component";
import PrivateSaleComponent from "./components/private-sale/private-sale.component";
import PreICOSaleComponent from "./components/pre-ico-sale/pre-ico-sale.component";
import ICOSaleComponent from "./components/ico-sale/ico-sale.component";
import TimeComponent from "./components/time/time.component";
import BasicActionsComponent from "./components/basic-actions/basic-actions.component";
import OwnerActionsComponent from "./components/owner-actions/owner-actions.component";

// Services.
import Web3Service from "./services/web3.service";

// Filters.
import { DotSeparatorFilter } from "./filters/dot-separator.filter";

const module = angular.module("OpenHouseAdminPanel", ["ngRoute", "toastr"]);

declare var ethereum;

// The routing configuration.
module.config(["$routeProvider", "$locationProvider", 
    ($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider) => {
        $locationProvider.hashPrefix("");
        $routeProvider
            .when("/privateSale", {
                template: "<private-sale-component></private-sale-component>",
                resolve: {
                    metamask: () => {
                        return ethereum.enable();
                    }
                }
            })
            .when("/preICOSale", {
                template: "<pre-ico-sale-component></pre-ico-sale-component>",
                resolve: {
                    metamask: () => {
                        return ethereum.enable();
                    }
                }
            })
            .when("/ICOSale", {
                template: "<ico-sale-component></ico-sale-component>",
                resolve: {
                    metamask: () => {
                        return ethereum.enable();
                    }
                }
            })
            .otherwise({
                redirectTo: "/privateSale"
            });
}]);

// Wiring up the components.
module.component("navbarComponent", new NavbarComponent());
module.component("detailsComponent", new DetailsComponent());
module.component("privateSaleComponent", new PrivateSaleComponent());
module.component("preIcoSaleComponent", new PreICOSaleComponent());
module.component("icoSaleComponent", new ICOSaleComponent());
module.component("timeComponent", new TimeComponent());
module.component("basicActionsComponent", new BasicActionsComponent());
module.component("ownerActionsComponent", new OwnerActionsComponent());

// Wiring up the services.
module.service("web3Service", Web3Service);

// Wiring up the filters.
module.filter("dotSeparatorFilter", DotSeparatorFilter);

// Wiring up the constants.
module.constant("OpenHouseToken", OpenHouseToken);
module.constant("PrivateSale", PrivateSale);

module.constant("OpenHouseTokenContractAddress", "0x3dcf361f50bd496cA4CF02564D06609cAf23Ce94");
module.constant("PrivateSaleContractAddress", "0x1Cc4248Fe1703daA79557351E153dc399F5B0FF8");

angular.element(document).ready(() => {
    angular.bootstrap(document, ["OpenHouseAdminPanel"]);
});