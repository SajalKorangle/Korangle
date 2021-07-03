export class OnlineFeePaymentTransaction {
    parentSchool: number;
    parentOrder: string;
    feeDetailJSON: { [key: string]: any; };
    parentFeeReceipt: number;
}