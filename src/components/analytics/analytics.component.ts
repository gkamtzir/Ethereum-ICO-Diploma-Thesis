import IWeb3Service from "../../interfaces/services/web3.interface";
import AnalyticsService from "./services/analytics.service";

const { Chart } = require("chart.js");
const moment = require("moment");

// Interfaces.
import ISale from "./interfaces/sale.interface";

class AnalyticsController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service", "analyticsService"];

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
    private data: ISale[];

    constructor(
        public web3Service: IWeb3Service,
        private analyticsService: any
    ) {
        this.selectedStage = "private";
        this.data = [];
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

        console.log(this.analyticsService);
        let response = await this.analyticsService.getSales();
        this.data = response.data;

        console.log(this.data);

        // Creating the 3 sale charts.
        this.createSaleCharts();
    }

    /**
     * Creates the sale charts.
     */
    private createSaleCharts(): void {
        let {
            privateSaleData,
            privateSaleDates,
            privateSaleMaxY,
            preICOSaleData,
            preICOSaleDates,
            preICOSaleMaxY,
            ICOSaleData,
            ICOSaleDates,
            ICOSaleMaxY
        } = this.prepareSaleData();

        // Creating the sale's charts.
        this.createChart("privateSaleChart", "Private Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            privateSaleDates, privateSaleData, privateSaleMaxY);
        this.createChart("preICOSaleChart", "Pre-ICO Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            preICOSaleDates, preICOSaleData, preICOSaleMaxY);
        this.createChart("ICOSaleChart", "ICO Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            ICOSaleDates, ICOSaleData, ICOSaleMaxY);
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

        this.data.forEach(sale => {
            let date = moment(sale.timestamp).format("YYYY-MM-DD");
            structure[sale.stage][date] += sale.amount;
        });

        let privateSaleData = [];
        let privateSaleDates = [];

        let preICOSaleData = [];
        let preICOSaleDates = [];

        let ICOSaleData = [];
        let ICOSaleDates = [];

        let privateSaleMaxY = -1;
        let preICOSaleMaxY = -1;
        let ICOSaleMaxY = -1;

        for (let key in structure.private) {
            privateSaleData.push(structure.private[key]);
            if (structure.private[key] > privateSaleMaxY)
                privateSaleMaxY = structure.private[key];
            privateSaleDates.push(moment(key).format("DD-MM"));
        }
        
        for (let key in structure.pre) {
            preICOSaleData.push(structure.pre[key]);
            if (structure.pre[key] > preICOSaleMaxY)
                preICOSaleMaxY = structure.pre[key];
            preICOSaleDates.push(moment(key).format("DD-MM"));
        }

        for (let key in structure.ico) {
            ICOSaleData.push(structure.ico[key]);
            if (structure.ico[key] > ICOSaleMaxY)
                ICOSaleMaxY = structure.ico[key];
            ICOSaleDates.push(moment(key).format("DD-MM"));
        }

        privateSaleMaxY += 10**(privateSaleMaxY.toString().length - 1);
        preICOSaleMaxY += 10**(preICOSaleMaxY.toString().length - 1);
        ICOSaleMaxY += 10**(ICOSaleMaxY.toString().length - 1);

        return {
            privateSaleData,
            privateSaleDates,
            privateSaleMaxY,
            preICOSaleData,
            preICOSaleDates,
            preICOSaleMaxY,
            ICOSaleData,
            ICOSaleDates,
            ICOSaleMaxY
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
            <div>
                <canvas id="redeemChart" class="chart-size" height="400"></canvas>
            </div>
            <div>
                <canvas id="refundChart" class="chart-size" height="400"></canvas>
            </div>
        </div>
    `;
    }
}