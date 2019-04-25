class TimeController implements ng.IComponentController {

    constructor() {}
}

export default class TimeComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = TimeController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="time-component">
            <h4>Time Manipulation</h4>
        </div>
    `;
    }
}