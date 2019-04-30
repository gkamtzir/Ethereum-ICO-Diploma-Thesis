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
import "./components/time/time.component.scss";
import "./components/basic-actions/basic-actions.component.scss";
import "./components/owner-actions/owner-actions.component.scss";

// Application dependencies.

// Components.
import NavbarComponent from "./components/navbar/navbar.component";
import DetailsComponent from "./components/details/details.component";
import PrivateSaleComponent from "./components/private-sale/private-sale.component";
import PreICOSaleComponent from "./components/pre-ico-sale/pre-ico-sale.component";
import TimeComponent from "./components/time/time.component";
import BasicActionsComponent from "./components/basic-actions/basic-actions.component";
import OwnerActionsComponent from "./components/owner-actions/owner-actions.component";

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
                template: "ICO Sale"
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
module.component("timeComponent", new TimeComponent());
module.component("basicActionsComponent", new BasicActionsComponent());
module.component("ownerActionsComponent", new OwnerActionsComponent());

angular.element(document).ready(() => {
    angular.bootstrap(document, ["OpenHouseAdminPanel"]);
});