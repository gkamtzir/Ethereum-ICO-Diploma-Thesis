import IWeb3Service from "../../interfaces/services/web3.interface";
import "chartjs-plugin-annotation";
const { Chart } = require("chart.js");
const moment = require("moment");
const { BigNumber } = require("bignumber.js");

// Interfaces.
import IAnalyticsService from "./interfaces/analytics.interface";
import ISale from "./interfaces/sale.interface";
import IRefund from "./interfaces/refund.interface";
import IRedeem from "./interfaces/redeem.interface";
import IRent from "./interfaces/rent.interface";
import IEnrolment from "./interfaces/enrolment.interface";

class AnalyticsController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service", "analyticsService", "toastr"];

    // Public variables.
    public selectedStage: string;

    // Private variables.
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
    private enrolmentData: IEnrolment;
    private power: any;

    private softCaps = {
        "private": 0,
        "pre": 0,
        "ico": 0
    };

    constructor(
        private web3Service: IWeb3Service,
        private analyticsService: IAnalyticsService,
        private toastr: ng.toastr.IToastrService
    ) {
        this.selectedStage = "private";
        this.saleData = [];
        this.refundData = [];
        this.redeemData = [];
        this.rentData = [];
        this.enrolmentData = {};
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

        // Fetching sales' soft caps.
        let privateSoftCap = await this.privateSaleContract.methods.getTokensMinCap.call().call();
        this.softCaps.private = parseInt(privateSoftCap);

        let preSoftCap = await this.preICOSaleContract.methods.getTokensMinCap.call().call();
        this.softCaps.pre = parseInt(preSoftCap);

        let icoSoftCap = await this.ICOSaleContract.methods.getTokensMinCap.call().call();
        this.softCaps.ico = parseInt(icoSoftCap);

        let decimals = await this.web3Service.tokenContract.methods.getDecimals.call().call();
        this.power = new BigNumber(10);
        this.power = this.power.pow(decimals);

        await this.getSaleData();
        await this.getRefundData();
        await this.getRedeemData();
        await this.getRentData();
        await this.getEnrolmentData("private");

        // Creating the charts.
        this.createSaleCharts();
        this.createRedeemChart();
        this.createRefundChart();
        this.createEnrolmentChart();
        this.createRentChart();
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
    private async getEnrolmentData(stage: string) {
        try {
            let response = await this.analyticsService.getEnrolments(stage);
            this.enrolmentData = response.data;
        } catch (exception) {
            this.toastr.error(`Could not retrieve enrolment data. Please try again later.`, "Error");
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

        let {
            privateCumulativeDates,
            privateCumulativeData,
            preCumulativeDates,
            preCumulativeData,
            icoCumulativeDates,
            icoCumulativeData
        } = this.getCumulativeSaleData();

        let privateMax = Math.max(...privateCumulativeData);
        let preMax = Math.max(...preCumulativeData);
        let icoMax = Math.max(...icoCumulativeData);

        // Creating the sale's charts.
        this.createChart("privateSaleChart", "Private Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            privateDates, privateData, privateMaxY);
        this.createChart("preICOSaleChart", "Pre-ICO Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            preICODates, preICOData, preICOMaxY);
        this.createChart("ICOSaleChart", "ICO Sale", "rgba(65, 105, 225, 0.7)", "Tokens bought",
            ICODates, ICOData, ICOMaxY);

        // Prepare annotations.
        let privateAnnotations = this.getAnnotations(this.softCaps.private);
        let preAnnotations = this.getAnnotations(this.softCaps.pre);
        let icoAnnotations = this.getAnnotations(this.softCaps.ico);

        // Creating the cumulative sale charts.
        this.createChart("privateSaleCumulativeChart", "Road to soft cap", "rgba(152, 251, 152, 0.7)", "Tokens bought (Cumulative)",
            privateCumulativeDates, privateCumulativeData, privateMax < this.softCaps.private ? this.softCaps.private : privateMax, "line",
            privateAnnotations);
        this.createChart("preICOSaleCumulativeChart", "Road to soft cap", "rgba(152, 251, 152, 0.7)", "Tokens bought (Cumulative)",
            preCumulativeDates, preCumulativeData, preMax < this.softCaps.pre ? this.softCaps.pre : preMax, "line", preAnnotations);
        this.createChart("ICOSaleCumulativeChart", "Road to soft cap", "rgba(152, 251, 152, 0.7)", "Tokens bought (Cumulative)",
            icoCumulativeDates, icoCumulativeData, icoMax < this.softCaps.ico ? this.softCaps.ico : icoMax, "line", icoAnnotations);
    }

    /**
     * Fetches chart line-annotations.
     * @param value The line value.
     */
    private getAnnotations(value: number): any {
        return {
            annotations: [
                {
                    id: "hline",
                    type: "line",
                    mode: "horizontal",
                    scaleID: "y-axis-0",
                    value,
                    borderColor: "rgba(0,100,0)",
                    borderWidth: 2,
                    label: {
                      backgroundColor: "rgba(0,100,0)",
                      content: "Soft Cap",
                      enabled: true
                    }
                }
            ]
        }
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
     * Creates the enrolment chart.
     */
    private createEnrolmentChart(): void {
        let labels = [];
        let data = [];
        let colors = [];

        for (let prop in this.enrolmentData) {
            labels.push(prop);
            data.push(this.enrolmentData[prop]);
            colors.push(this.generateColor());
        }

        this.createPieChart(labels, data, colors);
    }

    /**
     * Creates the rental chart.
     */
    private createRentChart(): any {
        let labels = ["Tokens", "Duration (in days)", "Price (in ether)", "Time (in days)"];
        let datasets = [];

        this.rentData.forEach((rent, index) => {
            if (!(rent.leasedTo != null))
                return;

            let dateCreated = moment(rent.offerCreatedTimestamp);
            let dateLeased = moment(rent.leasedTimestamp);
            let days: number = dateLeased.diff(dateCreated, "days");

            let tokens = new BigNumber(rent.numberOfTokens);

            datasets.push({
                label: `Rental #${index}`,
                backgroundColor: this.generateColor(),
                data: [parseFloat(tokens.div(this.power)), parseInt(rent.duration) / (3600 * 24), this.web3Service.toEther(rent.price), days]
            });
        });

        let ctx = (document.getElementById("rentChart") as HTMLCanvasElement).getContext("2d");
        let chart = new Chart(ctx, {
            type: "radar",
            data: {
                labels,
                datasets
            },
            options: {
                title: {
                    display: true,
                    text: "Rental Radar"
                },
                tooltips: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ' : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        }
                    }
                },
                maintainAspectRatio: false
            }
        });
    }

    /**
     * Generates random colors for charts.
     */
    private generateColor(): string {
        let red = Math.floor((Math.random() * 1000) % 255);
        let green = Math.floor((Math.random() * 1000) % 255);
        let blue = Math.floor((Math.random() * 1000) % 255);

        return `rgba(${red}, ${green}, ${blue}, 0.7)`;
    }

    /**
     * Prepares the cumulative sale data for the given stage.
     */
    private getCumulativeSaleData(): any {
        let privateStageData = [];
        let preICOStageData = [];
        let ICOStageData = [];

        this.saleData.forEach(sale => {
            if (sale.stage === "private")
                privateStageData.push(sale);
            else if (sale.stage === "pre")
                preICOStageData.push(sale);
            else
                ICOStageData.push(sale);
        });

        // Sort data by date.
        privateStageData.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
        preICOStageData.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
        ICOStageData.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
        
        let {
            cumulativeDates: privateCumulativeDates,
            cumulativeData: privateCumulativeData
        } = this.createCumulativeData(privateStageData);

        let {
            cumulativeDates: preCumulativeDates,
            cumulativeData: preCumulativeData
        } = this.createCumulativeData(preICOStageData);

        let {
            cumulativeDates: icoCumulativeDates,
            cumulativeData: icoCumulativeData
        } = this.createCumulativeData(ICOStageData);

        return {
            privateCumulativeDates,
            privateCumulativeData,
            preCumulativeDates,
            preCumulativeData,
            icoCumulativeDates,
            icoCumulativeData
        }
    }

    /**
     * Creates the actual cumulative data.
     * @param data The unprocessed data.
     */
    private createCumulativeData(data: ISale[]): any {
        let sum = 0;
        let cumulativeData = [];
        let cumulativeDates = [];

        for (let i = 0; i < data.length; i++) {
            let date = moment(data[i].timestamp).format("DD-MM-YYYY");
            if (i > 0 && cumulativeDates[cumulativeDates.length - 1] === date) {
                sum += data[i].amount;
                cumulativeData[cumulativeData.length - 1] += data[i].amount;
            } else {
                cumulativeDates.push(date);
                sum += data[i].amount;
                cumulativeData.push(sum);
            }
        }

        return {
            cumulativeDates,
            cumulativeData
        }
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
     * Creates the bar chart.
     * @param elementId The DOM canvas element to create the chart.
     * @param title Chart title.
     * @param color Chart color.
     * @param yAxisText Y axis text.
     * @param dates The date labels.
     * @param data The actual data.
     * @param yUpperBound Y axis upper bound.
     * @param type Chart type.
     * @param annotations Extra annotations for the chart.
     */
    private createChart(elementId: string, title: string, color: string, yAxisText: string, dates: string[], 
        data: number[], yUpperBound: number, type: string = "bar", annotation?: any): void {
        let ctx = (document.getElementById(elementId) as HTMLCanvasElement).getContext("2d");
        let chart = new Chart(ctx, {
            type,
            data: {
                labels: dates,
                datasets: [
                    {
                        data: data,
                        backgroundColor: color,
                        lineTension: 0,
                        fill: "start"
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
                                suggestedMax: yUpperBound
                            },
                            scaleLabel: {
                                display: true,
                                padding: 10,
                                labelString: yAxisText
                              }
                        }]
                    },
                    annotation
                }
        });
    }

    /**
     * Creates the pie chart.
     * @param labels Chart's labels.
     * @param data Chart's actual data.
     * @param colors Charts colors.
     */
    private createPieChart(labels: string[], data: number[], colors: string[]): void {
        let ctx = (document.getElementById("enrolmentChart") as HTMLCanvasElement).getContext("2d");
        let chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: colors
                    }
                ]},
                options: {
                    title: {
                        display: true,
                        text: "Enrolment"
                    },
                    maintainAspectRatio: false
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
                <canvas id="privateSaleCumulativeChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'private'"></canvas>
                <canvas id="preICOSaleCumulativeChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'pre'"></canvas>
                <canvas id="ICOSaleCumulativeChart" class="chart-size" height="400" ng-show="$ctrl.selectedStage === 'ico'"></canvas>
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
            <div class="details-card sale-chart" ng-show="$ctrl.selectedStage === 'private'">
                <canvas id="enrolmentChart" class="chart-size" height="400"></canvas>
            </div>
            <div class="details-card sale-chart">
                <canvas id="rentChart" class="chart-size" height="400"></canvas>
            </div>
        </div>
    `;
    }
}