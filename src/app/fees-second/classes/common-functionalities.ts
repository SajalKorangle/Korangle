
export class FeeReceipt {

    static getFeeReceiptTotalAmount(feeReceipt: any): number {
        let amount = 0;
        feeReceipt['subFeeReceiptList'].forEach( subFeeReceipt => {
            amount += subFeeReceipt.amount;
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

    static getConcessionTotalAmount(concession: any): number {
        let amount = 0;
        concession['subConcessionList'].forEach( subConcession => {
            amount += subConcession.amount;
        });
        return amount;
    }

}
