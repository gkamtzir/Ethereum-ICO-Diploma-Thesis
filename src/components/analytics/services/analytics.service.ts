import { IPromise, IHttpResponse } from "angular";

// Interfaces.
import IAnalyticsService from "../interfaces/analytics.interface";
import ISale from "../interfaces/sale.interface";

export default class AnalyticsService implements IAnalyticsService{
    public static $inject = ["$http"];

    constructor(private $http: ng.IHttpService){}

    getSales(): IPromise<IHttpResponse<ISale[]>> {
        return this.$http({
            method: "GET",
            url: "http://83.212.115.201:8080/api/sale"
        });
    }
}