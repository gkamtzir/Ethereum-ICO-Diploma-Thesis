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
    getRefund(): IPromise<IHttpResponse<IRefund[]>>;
    getAllow(): IPromise<IHttpResponse<IAllow[]>>;
    getRent(): IPromise<IHttpResponse<IRent[]>>;
}