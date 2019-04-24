// AngularJS dependencies.
import * as angular from "angular";
import "angular-route/angular-route.min.js";

// Styling dependencies.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./components/navbar/navbar.component.scss";

// Application dependencies.

// Components.
import NavbarComponent from "./components/navbar/navbar.component";

const module = angular.module("OpenHouseAdminPanel", ["ngRoute"]);

// The routing configuration.
module.config(["$routeProvider", "$locationProvider", 
    ($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider) => {
        $locationProvider.hashPrefix("");
        $routeProvider
            .when("/privateSale", {
                template: "Private Sale",
            })
            .when("/preICOSale", {
                template: "Pre ICO Sale"
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

angular.element(document).ready(() => {
    angular.bootstrap(document, ["OpenHouseAdminPanel"]);
});