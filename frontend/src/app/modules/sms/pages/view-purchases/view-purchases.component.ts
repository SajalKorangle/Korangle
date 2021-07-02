import { Component, OnInit } from '@angular/core';
import { SmsService } from '@services/modules/sms/sms.service';
import { DataStorage } from '../../../../classes/data-storage';
import { ViewPurchasesServiceAdapter } from './view-purchases.service.adapter';
import { PaymentService } from '@services/modules/payment/payment.service';
import { Order } from '@services/modules/payment/models/order';
import { OnlineSmsPaymentTransaction } from '@services/modules/sms/models/online-sms-payment-transaction';
@Component({
    selector: 'view-purchases',
    templateUrl: './view-purchases.component.html',
    styleUrls: ['./view-purchases.component.css'],
    providers: [SmsService, PaymentService]
})
export class ViewPurchasesComponent implements OnInit {
    user;

    backendData: {
        smsPurchaseList: any[],
        incompleteOnlineSmsPaymentTransactionList: Array<OnlineSmsPaymentTransaction>,
        orderList: Array<Order>,
    } = {
            smsPurchaseList: null,
            incompleteOnlineSmsPaymentTransactionList: null,
            orderList: null,
        };

    parsedIncompleteTransactions: Array<ParsedTransaction> = null;

    isLoading: boolean = true;

    serviceAdapter: ViewPurchasesServiceAdapter;

    constructor(
        public smsService: SmsService,
        public paymentService: PaymentService,
    ) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ViewPurchasesServiceAdapter(this);
        this.serviceAdapter.initilizeDate();
    }

    formStructureFromBackendData() {
        this.parsedIncompleteTransactions
            = this.backendData.incompleteOnlineSmsPaymentTransactionList.map(transaction => {
                return {
                    ...transaction,
                    parentOrderInstance: this.backendData.orderList.find(order => order.orderId == transaction.parentOrder)
                };
            });
    }
}

interface ParsedTransaction extends OnlineSmsPaymentTransaction {
    parentOrderInstance: Order;
}