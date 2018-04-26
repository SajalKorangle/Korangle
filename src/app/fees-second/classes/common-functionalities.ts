
export class FeeReceipt {

    static getFeeReceiptTotalAmount(feeReceipt: any): number {
        let amount = 0;
        feeReceipt['subFeeReceiptList'].forEach( subFeeReceipt => {
            amount += subFeeReceipt.amount;
        });
        return amount;
    }

}
