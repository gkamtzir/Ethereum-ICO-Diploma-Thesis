export default interface IWeb3Service {
    tokenContract: any;
    privateSaleContract: any;
    increaseTime(duration: number);
    latestTime();
}