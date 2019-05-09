// Enumerations.
import { Status } from "../../../enumerations/ContractStatus";

export default interface IDetails {
    price: number;
    minCap: number;
    maxCap: number;
    startDate: Date;
    endDate: Date;
    redeemableAfterDate: Date;
    owner: string;
    status: Status;
}