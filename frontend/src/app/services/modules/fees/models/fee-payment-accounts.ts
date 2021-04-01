export const MODE_OF_PAYMENT = {
    'Cash': 'Cash',
    'Cheque': 'Cheque',
    'Online': 'Online',
};

export class FeePaymentAccounts{
    id: number;
    parentSchool: number;
    parentAccount: number;
    modeOfPayment: 'Cash' | 'Cheque' | 'Online';
};
