class TimeController implements ng.IComponentController {

    // Public variables.
    public timespans: any[];
    public selectedTimespan: any;
    public selectedRange: number;
    public currentDate: Date;
    public futureDate: Date;
    
    // Private variables.
    private durations: any;


    constructor() {
        // Initializing the durations.
        this.durations = {
            seconds: function(val: number) { return val; },
            minutes: function(val: number) { return val * this.seconds(60); },
            hours: function(val: number) { return val * this.minutes(60); },
            days: function(val: number) { return val * this.hours(24); },
            weeks: function(val: number) { return val * this.days(7); },
            years: function(val: number) { return val * this.days(365); },
        }

        // Initializing the supported timespans.
        this.timespans = [
            {
                name: "Seconds",
                type: "seconds"
            },
            {
                name: "Minutes",
                type: "minutes"
            },
            {
                name: "Hours",
                type: "hours"
            },
            {
                name: "Days",
                type: "days"
            },
            {
                name: "Weeks",
                type: "weeks"
            },
            {
                name: "Years",
                type: "years"
            }
        ];

        this.currentDate = new Date(Date.now());
        this.futureDate = new Date(Date.now());
        this.selectedRange = 0;
        this.selectedTimespan = this.timespans[0];
    }

    /**
     * Calculates the future date based on the selected range
     * and timespan.
     */
    public calculateFutureDate(): void {
        if (this.selectedTimespan != null) {
            let currentTime = Math.floor(this.currentDate.getTime() / 1000);
            let duration = this.durations[this.selectedTimespan.type](this.selectedRange);
            let currentTimeInMill = (currentTime + duration) * 1000;
            this.futureDate = new Date(currentTimeInMill);
        }
    }

    /**
     * Increases the time in the local ethereum blockchain (Ganache).
     */
    public increaseTime(): void {
        console.log("Time increased");
        this.currentDate = this.futureDate;
        this.selectedRange = 0;
    }
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
            <div class="row date-row">
                <div class="col-sm">
                    <div class="date">
                        <span class="date-text">Current Date:</span> {{ $ctrl.currentDate | date: "medium" }}
                    </div>
                    <div class="date">
                        <span class="date-text">Future Date:</span> {{ $ctrl.futureDate | date: "medium"}}
                    </div>
                </div>
                <div class="col-sm">
                    <div class="form-group align-right">
                        <label for="timespan-select">Select Timespan</label>
                        <select id="timespan-select" class="custom-select form-control" 
                            ng-options="timespan.name for timespan in $ctrl.timespans" ng-model="$ctrl.selectedTimespan">
                        </select>
                    </div>
                </div>
            </div>
            <label for="time-manipulation">Time range</label>
            <input type="range" class="custom-range" id="time-manipulation" min="0" max="12" ng-model="$ctrl.selectedRange" ng-change="$ctrl.calculateFutureDate()">
            <br />
            <button type="button" class="btn btn-primary" ng-click="$ctrl.increaseTime()">Increase Time</button>
        </div>
    `;
    }
}