
import {FREQUENCY_LIST} from './constants';

export class FeeReceipt {

    static getSubFeeReceiptAmount(subFeeReceipt: any): number {
        let amount = 0;
        if (subFeeReceipt.frequency === FREQUENCY_LIST[0]) {
            amount = subFeeReceipt.amount;
        } else if (subFeeReceipt.frequency === FREQUENCY_LIST[1]) {
            subFeeReceipt.monthList.forEach(month => {
                amount += month.amount;
            });
        }
        return amount;
    }

    static getFeeReceiptTotalAmount(feeReceipt: any, feeType: any = 'All'): number {
        let amount = 0;
        feeReceipt['subFeeReceiptList'].forEach( subFeeReceipt => {
            if (feeType === 'All' || subFeeReceipt.feeType === feeType) {
                amount += FeeReceipt.getSubFeeReceiptAmount(subFeeReceipt);
            }
        });
        return amount;
    }

}

export class Concession {

    static getConcessionListTotalAmount(concessionList: any): number {
        let amount = 0;
        concessionList.forEach(concession => {
            amount += Concession.getConcessionTotalAmount(concession);
        });
        return amount;
    }

    static getSubConcessionAmount(subConcession: any): number {
        let amount = 0;
        if (subConcession.frequency === FREQUENCY_LIST[0]) {
            amount = subConcession.amount;
        } else if (subConcession.frequency === FREQUENCY_LIST[1]) {
            subConcession.monthList.forEach(month => {
                amount += month.amount;
            });
        }
        return amount;
    }

    static getConcessionTotalAmount(concession: any): number {
        let amount = 0;
        concession['subConcessionList'].forEach( subConcession => {
            amount += Concession.getSubConcessionAmount(subConcession);
        });
        return amount;
    }

}
