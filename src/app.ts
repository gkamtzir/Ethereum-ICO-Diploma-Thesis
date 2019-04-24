// AngularJS dependencies.
import * as angular from "angular";
import "angular-route/angular-route.min.js";

// Bootstrap dependencies.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

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

// The main controller of the application.
module.controller("MainController",  function () {
    this.activeTab = "#/privateSale";
});

angular.element(document).ready(() => {
    angular.bootstrap(document, ["OpenHouseAdminPanel"]);
});