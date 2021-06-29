export class Order {
    orderId: string;
    amount: number;
    status: typeof STATUS_CHOICES[number];
    referenceId: string;
}

export const STATUS_CHOICES = <const>['Pending', 'Completed', 'Failed', 'Refund Pending', 'Refund Initiated', 'Refunded', 'Forwarded to School'];
