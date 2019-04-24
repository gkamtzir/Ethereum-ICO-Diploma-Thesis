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
            <h1>Private Sale</h1>
            <details-component></details-component>
        </div>
    `;
    }
}