

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

export const MODE_OF_PAYMENT_LIST = [
    'Cash',
    'Cheque',
    'Online',
];

export class ReceiptColumnFilter {
    'receiptNumber'= true;
    'name'= true;
    'scholarNumber'= true;
    'class'= true;
    'amount'= true;
    'modeOfPayment' = false;
    'chequeNumber' = false;
    'date'= true;
    'remark'= true;
    'employee'= true;
    'printButton'= true;
}

export class DiscountColumnFilter {
    'discountNumber'= true;
    'name'= true;
    'scholarNumber'= true;
    'class'= true;
    'amount'= true;
    'date'= true;
    'remark'= true;
    'employee'= true;
}