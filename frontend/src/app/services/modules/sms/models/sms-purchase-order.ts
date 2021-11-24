export class SmsPurchaseOrder {
    id?: number;
    parentSchool: number;
    parentOrder: string;
    smsPurchaseData: { [key: string]: any; };
    parentSmsPurchase: number;
}