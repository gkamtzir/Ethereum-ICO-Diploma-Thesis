export default interface IDetails {
    price: number;
    minCap: number;
    maxCap: number;
    startDate: Date;
    endDate: Date;
    redeemableAfterDate: Date;
    owner: string;
    status: number;
}