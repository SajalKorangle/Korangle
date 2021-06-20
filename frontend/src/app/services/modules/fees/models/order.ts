export class Order {
    amount: number;
    status: typeof STATUS_CHOICES[number];
}

export const STATUS_CHOICES = <const>['Pending', 'Completed'];
