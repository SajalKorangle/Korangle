
import { MONTH_LIST } from './constants';

export class AmountFrequency {

    annualAmount: number = null;
    monthAmountList: any;
    showMonthDetails: boolean = false;

    constructor() {
        this.monthAmountList = [];
        MONTH_LIST.forEach(month => {
            let tempMonth = {};
            tempMonth['month'] = month;
            tempMonth['amount'] = null;
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

    getMonthTotal(): number {
        let amount = 0;
        this.monthAmountList.forEach(month => {
            amount += month.amount;
        });
        return amount;
    }

}