
import {

    CLASS_BASED_FILTER,
    CLASS_BUS_STOP_BASED_FILTER,
    BUS_STOP_BASED_FILTER,
    NO_FILTER,

    YEARLY,
    MONTHLY,

} from './constants';

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

    toServerObject(): any {
        let data = {};
        data['feeType'] = this.feeType;
        data['feeTypeDbId'] = this.feeTypeDbId;
        data['filterType'] = this.filterType;
        data['frequency'] = this.frequency;
        data['rte'] = this.rte;

        switch (this.filterType) {
            case NO_FILTER:
                if (this.frequency === YEARLY) {
                    data['amount'] = this.amountFrequency.annualAmount;
                } else if (this.frequency === MONTHLY) {
                    data['monthList'] = this.amountFrequency.toServerObjectForMonth();
                }
                break;
            case CLASS_BASED_FILTER:
                data['componentList'] = this.toServerObjectForClassList();
                break;
            case BUS_STOP_BASED_FILTER:
                data['componentList'] = this.toServerObjectForBusStopList();
                break;
            case CLASS_BUS_STOP_BASED_FILTER:
                break;
        }

        return data;
    }

    toServerObjectForClassBusStopList(): any {
        let data = [];
        this.busStopList.forEach(busStop => {
            busStop.classList.forEach( classs => {
                let tempClassBusStop = {};
                tempClassBusStop['stopName'] = busStop.stopName;
                tempClassBusStop['stopDbId'] = busStop.dbId;
                tempClassBusStop['className'] = classs.name;
                tempClassBusStop['classDbId'] = classs.dbId;
                if (this.frequency === YEARLY) {
                    tempClassBusStop['amount'] = classs.amountFrequency.annualAmount;
                } else if (this.frequency === MONTHLY) {
                    tempClassBusStop['monthList'] = classs.amountFrequency.toServerObjectForMonth();
                }
                data.push(tempClassBusStop);
            });
        });
        return data;
    }

    toServerObjectForBusStopList(): any {
        let data = [];
        this.busStopList.forEach(busStop => {
            let tempBusStop = {};
            tempBusStop['name'] = busStop.name;
            tempBusStop['dbId'] = busStop.dbId;
            if (this.frequency === YEARLY) {
                tempBusStop['amount'] = busStop.amountFrequency.annualAmount;
            } else if (this.frequency === MONTHLY) {
                tempBusStop['monthList'] = busStop.amountFrequency.toServerObjectForMonth();
            }
            data.push(tempBusStop);
        });
        return data;
    }

    toServerObjectForClassList(): any {
        let data = [];
        this.classList.forEach(classs => {
            let tempClass = {};
            tempClass['name'] = classs.name;
            tempClass['dbId'] = classs.dbId;
            if (this.frequency === YEARLY) {
                tempClass['amount'] = classs.amountFrequency.annualAmount;
            } else if (this.frequency === MONTHLY) {
                tempClass['monthList'] = classs.amountFrequency.toServerObjectForMonth();
            }
            data.push(tempClass);
        });
        return data;
    }

    populateAllLists(classList: any, busStopList: any): void {
        this.classList = [];
        this.busStopList = [];

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
        item.amountFrequency.populateAllMonthsAmount(event.target.value);
    }

    handleBusStopClassYearlyChange(event: any, busStop: any): void {
        busStop['classList'].forEach( classs => {
            classs.amountFrequency.annualAmount = event.target.value;
        });
    }

}