export const ACCOUNT_TYPE_CHOICES = {
    GROUP: 'GROUP',
    ACCOUNT: 'ACCOUNT',
};

export class Account {
    id: number;
    parentSchool: number;
    accountType: 'ACCOUNT' | 'GROUP';
    title: string;
}
