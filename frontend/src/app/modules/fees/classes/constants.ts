export const INSTALLMENT_LIST = [
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
    'january',
    'february',
    'march',
];

export const MODE_OF_PAYMENT_LIST = ['Cash', 'Cheque', 'Online'];

export class ReceiptColumnFilter {
    'receiptNumber' = true;
    'nameClass' = true;
    'scholarNumber' = true;
    'amount' = true;
    'modeOfPayment' = false;
    'chequeNumber' = false;
    'cancelledBy' = false;
    'date' = true;
    'remark' = true;
    'employee' = true;
    'printButton' = true;
    'status' = true;
    'mobileNumber' = false;
    'cancelledRemark' = false;
    'cancelledDate' = false;
    'session' = true;
}

export class DiscountColumnFilter {
    'discountNumber' = true;
    'name' = true;
    'scholarNumber' = true;
    'class' = true;
    'amount' = true;
    'date' = true;
    'remark' = true;
    'employee' = true;
}


export const KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE = 3;
