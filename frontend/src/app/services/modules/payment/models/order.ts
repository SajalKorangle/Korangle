export class Order {
    id?: number;
    orderId: string;
    amount: number;
    status: typeof STATUS_CHOICES[number];
    referenceId: string;
    dateTime: string;
}

export const STATUS_CHOICES = <const>['Pending', 'Completed', 'Failed', 'Refund Pending', 'Refund Initiated', 'Refunded'];
