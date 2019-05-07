import IWeb3Service from "../../interfaces/services/web3.interface";

class PrivateSaleController implements ng.IComponentController {

    public static $inject = ["web3Service"];

    public privateSaleContract: any;

    constructor(
        public web3Service: IWeb3Service
    ) {}

    $onInit() {
        this.privateSaleContract = this.web3Service.privateSaleContract;
    }
}

export default class PrivateSaleComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = PrivateSaleController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="private-sale-component">
            <details-component sale-contract="$ctrl.privateSaleContract"></details-component>
            <time-component></time-component>
            <div class="row">
                <div class="col-sm">
                    <basic-actions-component></basic-actions-component>
                </div>
                <div class="col-sm">
                    <owner-actions-component restricted="true"></owner-actions-component>
                </div>
            </div>
        </div>
    `;
    }
}