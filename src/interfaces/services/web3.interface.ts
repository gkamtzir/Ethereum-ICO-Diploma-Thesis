export default interface IWeb3Service {
    tokenContract: any;
    privateSaleContract: any;
    account: string;
    getMetamaskAccountOrNull();
    increaseTime(duration: number);
    latestTime();
}