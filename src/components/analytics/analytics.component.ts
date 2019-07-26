import IWeb3Service from "../../interfaces/services/web3.interface";

const { Chart } = require("chart.js");
const moment = require("moment");

// Interfaces.
import IAnalyticsService from "./interfaces/analytics.interface";
import ISale from "./interfaces/sale.interface";
import IRefund from "./interfaces/refund.interface";
import IRedeem from "./interfaces/redeem.interface";
import IRent from "./interfaces/rent.interface";
import IAllow from "./interfaces/allow.interface";

class AnalyticsController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service", "analyticsService", "toastr"];

    // Public variables.
    public selectedStage: string;

    // Private variables.
    private salesChart: any;
    private privateSaleContract: any;
    private preICOSaleContract: any;
    private ICOSaleContract: any;
    private privateSaleStart: any;
    private privateSaleEnd: any;
    private preICOSaleStart: any;
    private preICOSaleEnd: any;
    private ICOSaleStart: any;
    private ICOSaleEnd: any;
    private saleData: ISale[];
    private refundData: IRefund[];
    private redeemData: IRedeem[];
    private rentData: IRent[];
    private allowData: IAllow[];

    constructor(
        public web3Service: IWeb3Service,
        private analyticsService: IAnalyticsService,
        private toastr: ng.toastr.IToastrService
    ) {
        this.selectedStage = "private";
        this.saleData = [];
        this.refundData = [];
        this.redeemData = [];
        this.rentData = [];
        this.allowData = [];
    }

    async $onInit() {
        this.privateSaleContract = this.web3Service.privateSaleContract;
        this.preICOSaleContract = this.web3Service.preICOSaleContract;
        this.ICOSaleContract = this.web3Service.ICOSaleContract;

        // Fetching the start-end marks.
        let privateSaleStart = await this.privateSaleContract.methods.getStartTimestamp.call().call();
        this.privateSaleStart = moment(new Date(privateSaleStart * 1000));

        let privateSaleEnd = await this.privateSaleContract.methods.getEndTimestamp.call().call();
        this.privateSaleEnd = moment(new Date(privateSaleEnd * 1000));

        let preICOSaleStart = await this.preICOSaleContract.methods.getStartTimestamp.call().call();
        this.preICOSaleStart = moment(new Date(preICOSaleStart * 1000));

        let preICOSaleEnd = await this.preICOSaleContract.methods.getEndTimestamp.call().call();
        this.preICOSaleEnd = moment(new Date(preICOSaleEnd * 1000));

        let ICOSaleStart = await this.ICOSaleContract.methods.getStartTimestamp.call().call();
        this.ICOSaleStart = moment(new Date(ICOSaleStart * 1000));

        let ICOSaleEnd = await this.ICOSaleContract.methods.getEndTimestamp.call().call();
        this.ICOSaleEnd = moment(new Date(ICOSaleEnd * 1000));

        await this.getSaleData();
        await this.getRefundData();
        await this.getRedeemData();
        await this.getRentData();
        await this.getAllowData();

        // Creating the charts.
        this.createSaleCharts();
        this.createRedeemChart();
        this.createRefundChart();
    }

    /**
     * Fetches the sale data.
     */
    private async getSaleData() {
        try {
            let response = await this.analyticsService.getSales();
            this.saleData = response.data;
        } catch (exception) {
            this.toastr.error(`Could not retrieve sales data. Please try again later.`, "Error");
        }
    }

    /**
     * Fetches the refund data.
     */
    private async getRefundData() {
        try {
            let response = await this.analyticsService.getRefunds();
            this.refundData = response.data;
        } catch (exception) {
            this.toastr.error(`Could not retrieve refund data. Please try again later.`, "Error");
        }
    }

    /**
     * Fetches the redeem data.
     */
    private async getRedeemData() {
        try {
            let response = await this.analyticsService.getRedeems();
            this.redeemData = response.data;
        } catch (exception) {
            this.toastr.error(`Could not retrieve redeem data. Please try again later.`, "Error");
        }
    }

    /**
     * Fetches the rent data.
     */
    private async getRentData() {
        try {
            let response = await this.analyticsService.getRents();
            this.rentData = response.data;
        } catch (exception) {
            this.toastr.error(`Could not retrieve rent data. Please try again later.`, "Error");
        }
    }

    /**
     * Fetches the allow data.
     */
    private async getAllowData() {
        try {
            let response = await this.analyticsService.getAllows();
            this.allowData = response.data;
        } catch (exception) {
            this.toastr.error(`Could not retrieve allow data. Please try again later.`, "Error");
        }
    }

    /**
     * Creates the sale charts.
     */
    private createSaleCharts(): void {
        let {
            privateData,
            privateDates,
            privateMaxY,
            preICOData,
            preICODates,
            preICOMaxY,
            ICOData,
            ICODates,
            ICOMaxY
        } = this.prepareSaleData();

        // Creating the sale's charts.
        this.createChart("privateSaleChart", "Private Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            privateDates, privateData, privateMaxY);
        this.createChart("preICOSaleChart", "Pre-ICO Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            preICODates, preICOData, preICOMaxY);
        this.createChart("ICOSaleChart", "ICO Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            ICODates, ICOData, ICOMaxY);
    }

    /**
     * Preprocessing sale's data.
     */
    private prepareSaleData(): any {
        let structure = {
            "private": {},
            "pre": {},
            "ico": {}
        };

        let privateDays = this.privateSaleEnd.diff(this.privateSaleStart, "days");
        let preDays = this.privateSaleEnd.diff(this.privateSaleStart, "days");
        let icoDays = this.privateSaleEnd.diff(this.privateSaleStart, "days");

        for (let i = 0; i < privateDays; i++) {
            structure.private[this.privateSaleStart.add(1, "days").format("YYYY-MM-DD")] = 0;    
        }

        for (let i = 0; i < preDays; i++) {
            structure.pre[this.preICOSaleStart.add(1, "days").format("YYYY-MM-DD")] = 0;
        }

        for (let i = 0; i < icoDays; i++) {
            structure.ico[this.ICOSaleStart.add(1, "days").format("YYYY-MM-DD")] = 0;
        }

        this.saleData.forEach(sale => {
            let date = moment(sale.timestamp).format("YYYY-MM-DD");
            structure[sale.stage][date] += sale.amount;
        });

        return this.convertStructureToData(structure);
    }

    /**
     * Creates the redeem chart.
     */
    private createRedeemChart(): void {
        let {
            privateData,
            privateDates,
            privateMaxY,
            preICOData,
            preICODates,
            preICOMaxY,
            ICOData,
            ICODates,
            ICOMaxY
        } = this.prepareRedeemData();

        // Creating the redeem's charts.
        this.createChart("privateRedeemChart", "Private Sale Redeems", "rgba(34, 139, 34, 0.7)", "Tokens redeemed",
        privateDates, privateData, privateMaxY);
        this.createChart("preICORedeemChart", "Pre-ICO Sale Redeems", "rgba(34, 139, 34, 0.7)", "Tokens redeemed",
        preICODates, preICOData, preICOMaxY);
        this.createChart("ICORedeemChart", "ICO Sale Redeems", "rgba(34, 139, 34, 0.7)", "Tokens redeemed",
            ICODates, ICOData, ICOMaxY);
    }

    /**
     * Prepares the redeem data for charts.
     */
    private prepareRedeemData(): any {
        let structure = {
            "private": {},
            "pre": {},
            "ico": {}
        };

        this.redeemData.forEach(redeem => {
            let date = moment(redeem.timestamp).format("YYYY-MM-DD");
            if (structure[redeem.stage][date] != null)
                structure[redeem.stage][date] += redeem.amount;
            else
                structure[redeem.stage][date] = redeem.amount;
        });

        return this.convertStructureToData(structure);
    }

    /**
     * Creates the refund chart.
     */
    private createRefundChart(): void {
        let {
            privateData,
            privateDates,
            privateMaxY,
            preICOData,
            preICODates,
            preICOMaxY,
            ICOData,
            ICODates,
            ICOMaxY
        } = this.prepareRefundData();

        // Creating the refunds's charts.
        this.createChart("privateRefundChart", "Private Sale Refunds", "rgba(178, 34, 34, 0.7)", "Tokens refunded",
            privateDates, privateData, privateMaxY);
        this.createChart("preICORefundChart", "Pre-ICO Sale Refunds", "rgba(178, 34, 34, 0.7)", "Tokens refunded",
            preICODates, preICOData, preICOMaxY);
        this.createChart("ICORefundChart", "ICO Sale Refunds", "rgba(178, 34, 34, 0.7)", "Tokens refunded",
            ICODates, ICOData, ICOMaxY);
    }

    /**
     * Prepares the refund data for charts.
     */
    private prepareRefundData(): any {
        let structure = {
            "private": {},
            "pre": {},
            "ico": {}
        };

        this.refundData.forEach(refund => {
            let date = moment(refund.timestamp).format("YYYY-MM-DD");
            if (structure[refund.stage][date] != null)
                structure[refund.stage][date] += refund.amount;
            else
                structure[refund.stage][date] = refund.amount;
        });

        return this.convertStructureToData(structure);
    }

    /**
     * Converts the given structure to chart data.
     * @param structure The structure to be converted.
     */
    private convertStructureToData(structure: any): any {
        let privateData = [];
        let privateDates = [];

        let preICOData = [];
        let preICODates = [];

        let ICOData = [];
        let ICODates = [];

        let privateMaxY = -1;
        let preICOMaxY = -1;
        let ICOMaxY = -1;

        for (let key in structure.private) {
            privateData.push(structure.private[key]);
            if (structure.private[key] > privateMaxY)
                privateMaxY = structure.private[key];
            privateDates.push(moment(key).format("DD-MM"));
        }
        
        for (let key in structure.pre) {
            preICOData.push(structure.pre[key]);
            if (structure.pre[key] > preICOMaxY)
                preICOMaxY = structure.pre[key];
            preICODates.push(moment(key).format("DD-MM"));
        }

        for (let key in structure.ico) {
            ICOData.push(structure.ico[key]);
            if (structure.ico[key] > ICOMaxY)
                ICOMaxY = structure.ico[key];
            ICODates.push(moment(key).format("DD-MM"));
        }

        privateMaxY += 10**(privateMaxY.toString().length - 1);
        preICOMaxY += 10**(preICOMaxY.toString().length - 1);
        ICOMaxY += 10**(ICOMaxY.toString().length - 1);

        return {
            privateData,
            privateDates,
            privateMaxY,
            preICOData,
            preICODates,
            preICOMaxY,
            ICOData,
            ICODates,
            ICOMaxY
        };
    }

    /**
     * Creates the chart diagram.
     */
    public createChart(elementId: string, title: string, color: string, yAxisText: string, dates: string[], 
        data: number[], yUpperBound: number): void {
        var ctx = (document.getElementById(elementId) as HTMLCanvasElement).getContext("2d");
        this.salesChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: dates,
                datasets: [
                    {
                        data: data,
                        backgroundColor: color
                    }
                ]},
                options: {
                    title: {
                        display: true,
                        text: title
                    },
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Time"
                              }
                        }],
                        yAxes: [{ 
                            ticks: {
                                beginAtZero: true,
                                padding: 10,
                                max: yUpperBound
                            },
                            scaleLabel: {
                                display: true,
                                padding: 10,
                                labelString: yAxisText
                              }
                        }]
                    }
                }
        });
    }
}

export default class AnalyticsComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public controllerAs: string;
    public template: string;

    constructor() {
        this.bindings = {};
        this.controller = AnalyticsController;
        this.controllerAs = "$ctrl";
        this.template = `
        <div class="analytics-component">
            <h4>Analytics</h4>
            <div class="details-card">
                <b>Choose a stage</b>
                <div class="form-group">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="stage" id="private" value="private" ng-model="$ctrl.selectedStage" checked>
                        <label class="form-check-label" for="private">
                            Private Sale
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="stage" id="pre" value="pre" ng-model="$ctrl.selectedStage">
                        <label class="form-check-label" for="pre">
                            Pre-ICO Sale
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="stage" id="ico" value="ico" ng-model="$ctrl.selectedStage">
                        <label class="form-check-label" for="ico">
                            ICO Sale
                        </label>
                    </div>
                </div>
            </div>
            <div class="details-card sale-chart">
                <canvas id="privateSaleChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'private'"></canvas>
                <canvas id="preICOSaleChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'pre'"></canvas>
                <canvas id="ICOSaleChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'ico'"></canvas>
            </div>
            <div class="details-card sale-chart">
                <canvas id="privateRedeemChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'private'"></canvas>
                <canvas id="preICORedeemChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'pre'"></canvas>
                <canvas id="ICORedeemChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'ico'"></canvas>
            </div>
            <div class="details-card sale-chart">
            <canvas id="privateRefundChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'private'"></canvas>
            <canvas id="preICORefundChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'pre'"></canvas>
            <canvas id="ICORefundChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'ico'"></canvas>
            </div>
        </div>
    `;
    }
}