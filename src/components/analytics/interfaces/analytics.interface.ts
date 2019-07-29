import { IPromise, IHttpResponse } from "angular";

// Interfaces.
import ISale from "./sale.interface";
import IRedeem from "./redeem.interface";
import IRefund from "../interfaces/refund.interface";
import IEnrolment from "../interfaces/enrolment.interface";
import IRent from "../interfaces/rent.interface";

export default interface IAnalyticsService {
    getSales(): IPromise<IHttpResponse<ISale[]>>;
    getRedeems(): IPromise<IHttpResponse<IRedeem[]>>;
    getRefunds(): IPromise<IHttpResponse<IRefund[]>>;
    getEnrolments(stage: string): IPromise<IHttpResponse<IEnrolment>>;
    getRents(): IPromise<IHttpResponse<IRent[]>>;
    getOpenRents(): IPromise<IHttpResponse<IRent[]>>;
}