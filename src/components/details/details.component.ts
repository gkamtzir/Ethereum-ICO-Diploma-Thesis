class DetailsController implements ng.IComponentController {

    constructor() {}
}

export default class DetailsComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = DetailsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="details-component">
            <h3>Details</h3>
        </div>
    `;
    }
}