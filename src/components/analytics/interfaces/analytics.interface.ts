import { IPromise, IHttpResponse } from "angular";

// Interfaces.
import ISale from "./sale.interface";
import IRedeem from "./redeem.interface";
import IRefund from "../interfaces/refund.interface";

export default interface IAnalyticsService {
    getSales(): IPromise<IHttpResponse<ISale[]>>;
    getRedeems(): IPromise<IHttpResponse<IRedeem[]>>;
    getRefund(): IPromise<IHttpResponse<IRefund[]>>;
}