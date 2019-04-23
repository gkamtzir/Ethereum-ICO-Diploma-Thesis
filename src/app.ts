// AngularJS dependencies.
import * as angular from "angular";
import "angular-route/angular-route.min.js";

// Bootstrap dependencies.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const module = angular.module("openHouseAdminPanel", ["ngRoute"]);

module.config(["$routeProvider", "$locationProvider", ($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider) => {
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
        });
}]);

angular.element(document).ready(() => {
    angular.bootstrap(document, ["openHouseAdminPanel"]);
});