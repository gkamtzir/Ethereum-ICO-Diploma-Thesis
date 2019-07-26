import { IPromise, IHttpResponse } from "angular";

// Interfaces.
import ISale from "../interfaces/sale.interface";

export default class AnalyticsService {
    public static $inject = ["$http"];

    constructor(private $http: ng.IHttpService){}

    getSales(): IPromise<IHttpResponse<ISale[]>> {
        return this.$http({
            method: "GET",
            url: "http://83.212.115.201:8080/api/sale"
        });
    }
}