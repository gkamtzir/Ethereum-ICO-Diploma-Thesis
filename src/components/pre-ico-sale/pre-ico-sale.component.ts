class PreICOSaleController implements ng.IComponentController {

    constructor() {}
}

export default class PreICOSaleComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = PreICOSaleController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="pre-ico-sale-component">
            <details-component></details-component>
            <time-component></time-component>
            <div class="row">
                <div class="col-sm">
                    <basic-actions-component></basic-actions-component>
                </div>
                <div class="col-sm">
                    <owner-actions-component restricted="false"></owner-actions-component>
                </div>
            </div>
        </div>
    `;
    }
}