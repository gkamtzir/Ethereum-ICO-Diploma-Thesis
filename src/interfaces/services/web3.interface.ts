export default interface IWeb3Service {
    tokenContract: any;
    privateSaleContract: any;
    getMetamaskAccountOrNull();
    increaseTime(duration: number);
    latestTime();
    toWei(amount: number);
    toEther(amount: number);
}