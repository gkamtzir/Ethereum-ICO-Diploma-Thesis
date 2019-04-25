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
            <h4>Details</h4>
            <div class="details-card">
                <div class="row">
                    <div class="col-sm">
                        Price:
                    </div>
                    <div class="col-sm">
                        Minimum cap:
                    </div>
                    <div class="col-sm">
                        Maximum cap:
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        Start Date:
                    </div>
                    <div class="col-sm">
                        End Date:
                    </div>
                    <div class="col-sm">
                        Redeemable Date:
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}