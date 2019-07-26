import { IPromise, IHttpResponse } from "angular";

// Interfaces.
import ISale from "./sale.interface";

export default interface IAnalyticsService {
    getSales(): IPromise<IHttpResponse<ISale[]>>;
}