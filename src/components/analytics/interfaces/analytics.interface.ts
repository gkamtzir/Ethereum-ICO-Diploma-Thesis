import { IPromise, IHttpResponse } from "angular";

// Interfaces.
import ISale from "./sale.interface";
import IRedeem from "./redeem.interface";
import IRefund from "../interfaces/refund.interface";
import IAllow from "../interfaces/allow.interface";
import IRent from "../interfaces/rent.interface";

export default interface IAnalyticsService {
    getSales(): IPromise<IHttpResponse<ISale[]>>;
    getRedeems(): IPromise<IHttpResponse<IRedeem[]>>;
    getRefunds(): IPromise<IHttpResponse<IRefund[]>>;
    getAllows(): IPromise<IHttpResponse<IAllow[]>>;
    getRents(): IPromise<IHttpResponse<IRent[]>>;
}