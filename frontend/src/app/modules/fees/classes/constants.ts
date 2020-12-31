

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
    'nameClass'= true;
    'name'=false;
    'scholarNumber'= true;
    'class'= false;
    'amount'= true;
    'modeOfPayment' = false;
    'chequeNumber' = false;
    'date'= true;
    'remark'= true;
    'employee'= true;
    'printButton'= true;
    'status'=true;
    'mobileNumber'=true;
    'cancelledRemark'=false;
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
