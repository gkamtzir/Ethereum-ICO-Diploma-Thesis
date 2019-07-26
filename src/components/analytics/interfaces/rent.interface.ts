export default interface IRent {
    from: string;
    numberOfTokens: string;
    price: string;
    duration: string;
    offerCreatedTimestamp: string;
    leasedTo?: string;
    leasedTimestamp?: string;
}