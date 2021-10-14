import { ViewPurchasesComponent } from './view-purchases.component';

export class ViewPurchasesServiceAdapter {
    vm: ViewPurchasesComponent;

    constructor(vm: ViewPurchasesComponent) {
        this.vm = vm;
    }

    async initializeDate() {
        const incompleteTransactionRequest = {
            parentSmsPurchase: 'null__korangle'
        };

        [
            this.vm.backendData.smsPurchaseList,
            this.vm.backendData.incompleteOnlineSmsPaymentTransactionList,
        ] = await Promise.all([
            this.vm.smsService.getObjectList(this.vm.smsService.sms_purchase, {}),
            this.vm.smsService.getObjectList(this.vm.smsService.sms_purchase_order, incompleteTransactionRequest)
        ]);

        const orderRequest = {
            orderId__in: this.vm.backendData.incompleteOnlineSmsPaymentTransactionList.map(t => t.parentOrder)
        };
        this.vm.backendData.orderList = await this.vm.paymentService.getObjectList(this.vm.paymentService.order_school, orderRequest);
        this.vm.formStructureFromBackendData();
        this.vm.isLoading = false;
    }

}