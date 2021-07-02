export class OnlineSmsPaymentTransaction {
    id?: number;
    parentSchool: number;
    parentOrder: string;
    smsPurchaseJSON: { [key: string]: any; };
    parentSmsPurchase: number;
}