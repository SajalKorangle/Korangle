

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
    'Check',
];

export class ReceiptColumnFilter {
    'receiptNumber'= true;
    'name'= true;
    'scholarNumber'= true;
    'class'= true;
    'amount'= true;
    'modeOfPayment' = false;
    'checkNumber' = false;
    'date'= true;
    'remark'= true;
    'employee'= true;
    'printButton'= true;
}