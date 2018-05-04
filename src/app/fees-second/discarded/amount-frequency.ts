
import { MONTH_LIST } from './constants';

export class AmountFrequency {

    annualAmount: number = 0;
    monthAmountList: any;
    showMonthDetails: boolean = false;

    constructor() {
        this.monthAmountList = [];
        MONTH_LIST.forEach(month => {
            let tempMonth = {};
            tempMonth['month'] = month;
            tempMonth['amount'] = 0;
            this.monthAmountList.push(tempMonth);
        });
    }

    populateAllMonthsAmount(value: any): void {
        let index = 0;
        this.monthAmountList.forEach(month => {
            if (index >= 3) {
                month['amount'] = value;
            }
            ++index;
        });
    }

    toServerObjectForMonth(): any {
        return this.monthAmountList;
    }

}