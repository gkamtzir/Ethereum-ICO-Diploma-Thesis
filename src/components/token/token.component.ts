class TokenController implements ng.IComponentController {

    constructor() {}

}

export default class TokenComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = TokenController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="token-component">
            <h4>OpenHouse Token</h4>
        </div>
    `;
    }
}