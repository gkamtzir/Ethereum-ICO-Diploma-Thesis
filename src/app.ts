// AngularJS dependencies.
import * as angular from "angular";
import "angular-route/angular-route.min.js";

// Styling dependencies.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

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

const module = angular.module("OpenHouseAdminPanel", ["ngRoute"]);

// The routing configuration.
module.config(["$routeProvider", "$locationProvider", 
    ($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider) => {
        $locationProvider.hashPrefix("");
        $routeProvider
            .when("/privateSale", {
                template: "<private-sale-component></private-sale-component>",
            })
            .when("/preICOSale", {
                template: "<pre-ico-sale-component></pre-ico-sale-component>"
            })
            .when("/ICOSale", {
                template: "<ico-sale-component></ico-sale-component>"
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

// Wiring up the constants.
module.constant("OpenHouseToken", OpenHouseToken);
module.constant("PrivateSale", PrivateSale);

module.constant("OpenHouseTokenContractAddress", "0x8d0E3b91823d984967319727E926fDD1e8E928C7");
module.constant("PrivateSaleContractAddress", "0xd3a3685D5e7D786390ec0eA868B6FBB55C34f692");

angular.element(document).ready(() => {
    angular.bootstrap(document, ["OpenHouseAdminPanel"]);
});