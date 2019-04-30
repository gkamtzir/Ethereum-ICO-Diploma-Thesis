class PrivateSaleController implements ng.IComponentController {

    constructor() {}
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
            <details-component></details-component>
            <time-component></time-component>
            <div class="row">
                <div class="col-sm">
                    <basic-actions-component></basic-actions-component>
                </div>
                <div class="col-sm">
                    <owner-actions-component></owner-actions-component>
                </div>
            </div>
        </div>
    `;
    }
}