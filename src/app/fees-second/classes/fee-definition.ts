
import {AmountFrequency} from './amount-frequency';

export class FeeDefinition {
    feeType: string;
    feeTypeDbId: string;
    filterType: string;
    frequency: string;
    rte: boolean;

    amountFrequency: AmountFrequency = new AmountFrequency();

    classList: any;

    busStopList: any;

    busStopClassList: any;

    populateAllLists(classList: any, busStopList: any): void {
        this.classList = [];
        this.busStopList = [];
        // this.busStopClassList = [];

        classList.forEach(classs => {
            let tempClass = {};
            tempClass['name'] = classs.name;
            tempClass['dbId'] = classs.dbId;
            tempClass['amountFrequency'] = new AmountFrequency();
            this.classList.push(tempClass);
        });

        busStopList.forEach(busStop => {
            let tempBusStop = {};
            tempBusStop['stopName'] = busStop.stopName;
            tempBusStop['dbId'] = busStop.dbId;
            tempBusStop['amountFrequency'] = new AmountFrequency();
            tempBusStop['showClassDetails'] = false;
            tempBusStop['classList'] = [];
            classList.forEach(classs => {
                let tempClass = {};
                tempClass['name'] = classs.name;
                tempClass['dbId'] = classs.dbId;
                tempClass['amountFrequency'] = new AmountFrequency();
                tempBusStop['classList'].push(tempClass);
            });
            this.busStopList.push(tempBusStop);
        });

    }

    handleItemMonthlyChange(event: any, item: any): void {
        item.amountFrequency.showMonthDetails = true;
        item.amountFrequency.aprilAmount = 0;
        item.amountFrequency.mayAmount = 0;
        item.amountFrequency.juneAmount = 0;
        item.amountFrequency.julyAmount = event.target.value;
        item.amountFrequency.augustAmount = event.target.value;
        item.amountFrequency.septemberAmount = event.target.value;
        item.amountFrequency.octoberAmount = event.target.value;
        item.amountFrequency.novemberAmount = event.target.value;
        item.amountFrequency.decemberAmount = event.target.value;
        item.amountFrequency.januaryAmount = event.target.value;
        item.amountFrequency.februaryAmount = event.target.value;
        item.amountFrequency.marchAmount = event.target.value;
    }

    handleBusStopClassYearlyChange(event: any, busStop: any): void {
        busStop['classList'].forEach( classs => {
            classs.amountFrequency.annualAmount = event.target.value;
        });
    }

}