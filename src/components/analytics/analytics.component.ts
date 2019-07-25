import IWeb3Service from "../../interfaces/services/web3.interface";
const { Chart } = require("chart.js");
const moment = require("moment");

class AnalyticsController implements ng.IComponentController {

    // Controller's injectables.
    public static $inject = ["web3Service"];

    // Private variables.
    private salesChart: any;
    private privateSaleContract: any;
    private preICOSaleContract: any;
    private ICOSaleContract: any;
    private account: string;
    private privateSaleStart: any;
    private privateSaleEnd: any;
    private preICOSaleStart: any;
    private preICOSaleEnd: any;
    private ICOSaleStart: any;
    private ICOSaleEnd: any;

    data = [
        {
        "_id": "5d31d7af9d25d145ac7caa7e",
        "from": "0xDa2f980981cF32ca3e04058c6e94bC50618f46E9",
        "numberOfTokens": 5,
        "price": 540000000000000000,
        "duration": 3600,
        "offerCreatedTimestamp": "2019-08-28T14:46:07.140Z",
        "leasedTo": null,
        "stage": "private",
        "leasedTimestamp": null,
        "__v": 0
        },
        {
            "_id": "5d356c0485ba7a7ab66e417b",
            "from": "0x3C0F19C72dE749F5fd9860de0C64D6051B9Be8b3",
            "numberOfTokens": 8,
            "price": 12000000000000000000,
            "duration": 3600,
            "stage": "private",
            "offerCreatedTimestamp": "2019-09-11T07:55:48.641Z",
            "leasedTo": "0x47549A5A617c5918b2816d7bf0b3e7b8A63552D2",
            "leasedTimestamp": "2019-07-22T07:56:12.667Z",
            "__v": 0
        },
        {
        "_id": "5d356c0485ba7a7ab66e417b",
        "from": "0x3C0F19C72dE749F5fd9860de0C64D6051B9Be8b3",
        "numberOfTokens": 8,
        "price": 12000000000000000000,
        "duration": 3600,
        "stage": "private",
        "offerCreatedTimestamp": "2019-09-15T07:55:48.641Z",
        "leasedTo": "0x47549A5A617c5918b2816d7bf0b3e7b8A63552D2",
        "leasedTimestamp": "2019-07-22T07:56:12.667Z",
        "__v": 0
        }
        ];

    constructor(public web3Service: IWeb3Service) {
    }

    async $onInit() {
        this.privateSaleContract = this.web3Service.privateSaleContract;
        this.preICOSaleContract = this.web3Service.preICOSaleContract;
        this.ICOSaleContract = this.web3Service.ICOSaleContract;
        this.account = await this.web3Service.getMetamaskAccountOrNull();

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

        this.createSalesChart();
        // this.createRedeemChart();
        // this.createRefundChart();
    }

    private prepareSalesData(): any {
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
            let date = moment(sale.offerCreatedTimestamp).format("YYYY-MM-DD");
            console.log(date);
            console.log(sale.numberOfTokens);
            console.log(structure[sale.stage][date]);
            structure[sale.stage][date] += sale.numberOfTokens;
        });

        let privateSaleData = [];
        let privateSaleDates = [];

        let preICOSaleData = [];
        let preICOSaleDates = [];

        let ICOSaleData = [];
        let ICOSaleDates = [];

        for (let key in structure.private) {
            privateSaleData.push(structure.private[key]);
            privateSaleDates.push(key);
        }

        for (let key in structure.pre) {
            preICOSaleData.push(structure.private[key]);
            preICOSaleDates.push(key);
        }

        for (let key in structure.ico) {
            ICOSaleData.push(structure.private[key]);
            ICOSaleDates.push(key);
        }

        return {
            privateSaleData,
            privateSaleDates,
            preICOSaleData,
            preICOSaleDates,
            ICOSaleData,
            ICOSaleDates
        };
    }

    /**
     * Creates the sales' chart diagram.
     */
    public createSalesChart(): void {
        let {
            privateSaleData,
            privateSaleDates,
            preICOSaleData,
            preICOSaleDates,
            ICOSaleData,
            ICOSaleDates
        } = this.prepareSalesData();

        var ctx = (document.getElementById("saleChart") as HTMLCanvasElement).getContext("2d");
        this.salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: privateSaleDates,
                datasets: [
                    {
                        label: "Private Sale",
                        data: privateSaleData,
                    }
                ]},
                options: {
                    title: {
                        display: true,
                        text: 'Private Sale'
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Time'
                              }
                        }],
                        yAxes: [{ 
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Tokens bought'
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
            <canvas id="saleChart" class="chart-size" width="400" height="400"></canvas>
            <canvas id="redeemChart" class="chart-size" width="400" height="400"></canvas>
            <canvas id="refundChart" class="chart-size" width="400" height="400"></canvas>
        </div>
    `;
    }
}