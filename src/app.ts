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
import "./components/user-details/user-details.component.scss";
import "./components/private-sale/private-sale.component.scss";
import "./components/pre-ico-sale/pre-ico-sale.component.scss";
import "./components/ico-sale/ico-sale.component.scss";
import "./components/time/time.component.scss";
import "./components/basic-actions/basic-actions.component.scss";
import "./components/owner-actions/owner-actions.component.scss";
import "./components/token/token.component.scss";
import "./components/transfer/transfer.component.scss";
import "./components/utilities/utilities.component.scss";
import "./components/utilities-info/utilities-info.component.scss";
import "./components/analytics/analytics.component.scss";

// Application dependencies.

// Importing contract json files.
import * as OpenHouseToken from "../build/contracts/OpenHouseToken.json";
import * as PrivateSale from "../build/contracts/PrivateSale.json";
import * as PreICOSale from "../build/contracts/PreICOSale.json";
import * as ICOSale from "../build/contracts/ICOSale.json";

// Components.
import NavbarComponent from "./components/navbar/navbar.component";
import DetailsComponent from "./components/details/details.component";
import UserDetailsComponent from "./components/user-details/user-details.component";
import PrivateSaleComponent from "./components/private-sale/private-sale.component";
import PreICOSaleComponent from "./components/pre-ico-sale/pre-ico-sale.component";
import ICOSaleComponent from "./components/ico-sale/ico-sale.component";
import TimeComponent from "./components/time/time.component";
import BasicActionsComponent from "./components/basic-actions/basic-actions.component";
import OwnerActionsComponent from "./components/owner-actions/owner-actions.component";
import TokenComponent from "./components/token/token.component";
import TransferComponent from "./components/transfer/transfer.component";
import UtilitiesComponent from "./components/utilities/utilities.component";
import UtilitiesInfoComponent from "./components/utilities-info/utilities-info.component";
import AnalyticsComponent from "./components/analytics/analytics.component";

// Services.
import Web3Service from "./services/web3.service";
import AnalyticsService from "./components/analytics/services/analytics.service";

// Filters.
import { DotSeparatorFilter } from "./filters/dot-separator.filter";

const module = angular.module("OpenHouseAdminPanel", ["ngRoute", "toastr"]);

declare var ethereum;

// The routing configuration.
module.config(["$routeProvider", "$locationProvider", 
    ($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider) => {
        $locationProvider.hashPrefix("");
        $routeProvider
            .when("/", {
                template: "<token-component></token-component>",
                resolve: {
                    metamask: () => {
                        return ethereum.enable();
                    }
                }
            })
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
            .when("/analytics", {
                template: "<analytics-component></analytics-component>",
                resolve: {
                    metamask: () => {
                        return ethereum.enable();
                    }
                }
            })
            .otherwise({
                redirectTo: "/"
            });
}]);

// Wiring up the components.
module.component("navbarComponent", new NavbarComponent());
module.component("detailsComponent", new DetailsComponent());
module.component("userDetailsComponent", new UserDetailsComponent());
module.component("privateSaleComponent", new PrivateSaleComponent());
module.component("preIcoSaleComponent", new PreICOSaleComponent());
module.component("icoSaleComponent", new ICOSaleComponent());
module.component("timeComponent", new TimeComponent());
module.component("basicActionsComponent", new BasicActionsComponent());
module.component("ownerActionsComponent", new OwnerActionsComponent());
module.component("tokenComponent", new TokenComponent());
module.component("transferComponent", new TransferComponent());
module.component("utilitiesComponent", new UtilitiesComponent());
module.component("utilitiesInfoComponent", new UtilitiesInfoComponent());
module.component("analyticsComponent", new AnalyticsComponent());

// Wiring up the services.
module.service("web3Service", Web3Service);
module.service("analyticsService", AnalyticsService);

// Wiring up the filters.
module.filter("dotSeparatorFilter", DotSeparatorFilter);

// Wiring up the constants.
module.constant("OpenHouseToken", OpenHouseToken);
module.constant("PrivateSale", PrivateSale);
module.constant("PreICOSale", PreICOSale);
module.constant("ICOSale", ICOSale);

module.constant("OpenHouseTokenContractAddress", "0x03935EF155484A5d4C9B2bBeEE51400dFD3Af38c");
module.constant("PrivateSaleContractAddress", "0x86dc65a9490fDCF435fAd8dE98780522d8ba396c");
module.constant("PreICOSaleContractAddress", "0xcb6455E4552899a1c6922b94281795c88684c427");
module.constant("ICOSaleContractAddress", "0x893249D19Fb4328985213bA08447E59CAA200eE9");

angular.element(document).ready(() => {
    angular.bootstrap(document, ["OpenHouseAdminPanel"]);
});