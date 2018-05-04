
import {AmountFrequency} from './amount-frequency';

export class SchoolFeeComponent {

    dbId: number = 0;
    feeDefinitionDbId: number = 0;
    title: string = '-';

    amountFrequency: AmountFrequency = new AmountFrequency();

    classList: any = [];

    busStopList: any = [];

    fromServerObject(schoolFeeComponent: any): void {
        this.dbId = schoolFeeComponent.dbId;
        this.feeDefinitionDbId = schoolFeeComponent.feeDefinitionDbId;
        this.title = schoolFeeComponent.title;
        this.amountFrequency.annualAmount = schoolFeeComponent.amount;
        this.classList = [];
        this.busStopList = [];
        this.amountFrequency.monthAmountList = [];
        if ( 'classList' in schoolFeeComponent) {
            schoolFeeComponent.classList.forEach( classs => {
                let tempClass = {};
                tempClass['name'] = classs.name;
                tempClass['dbId'] = classs.dbId;
                this.classList.push(tempClass);
            });
        }
        if ( 'busStopList' in schoolFeeComponent) {
            schoolFeeComponent.busStopList.forEach( busStop => {
                let tempBusStop = {}
                tempBusStop['stopName'] = busStop.stopName;
                tempBusStop['dbId'] = busStop.dbId;
                this.busStopList.push(tempBusStop);
            });
        }
        if ( 'monthList' in schoolFeeComponent) {
            schoolFeeComponent.monthList.forEach(month => {
                let tempMonth = {};
                tempMonth['month'] = month.month;
                tempMonth['amount'] = month.amount;
                this.amountFrequency.monthAmountList.push(tempMonth);
            });
        }
    }

}