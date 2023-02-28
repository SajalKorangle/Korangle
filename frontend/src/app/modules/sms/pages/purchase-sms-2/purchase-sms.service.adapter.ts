
import { Query } from "@services/generic/query";
import { environment } from 'environments/environment';
import { PurchaseSmsComponent } from "./purchase-sms.component";

export class PurchaseSmsServiceAdapter {

    vm: PurchaseSmsComponent;

    purchasedSMS: number = 0;

    constructor() { }

    initializeAdapter(vm: PurchaseSmsComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.htmlAdapter.isInitialLoading = true;

        let purchaseQuery = new Query()
        .filter({id: this.vm.user.activeSchool.dbId})
        .annotate('purchaseCount', 'smsPurchaseList__numberOfSMS', 'Sum')
        .setFields('purchaseCount')
        .getObject({school_app: 'School'});

        let spentQuery = new Query()
        .filter({id: this.vm.user.activeSchool.dbId})
        .annotate('spentCount', 'sms__count', 'Sum', null, {sms__sentStatus: 'FAILED'})
        .setFields('spentCount')
        .getObject({school_app: 'School'});

        let modeOfPaymentQuery = new Query()
        .addChildQuery(
            'modeofpaymentcharges',
            new Query()
        )
        .addParentQuery(
            'parentPaymentGateway',
            new Query()
        )
        .getObjectList({payment_app: 'ModeOfPayment'});

        let purchaseValue, spentValue;

        [
            purchaseValue,
            spentValue,
            this.vm.htmlAdapter.modeOfPaymentList,
        ] = await Promise.all([
            purchaseQuery,
            spentQuery,
            modeOfPaymentQuery
        ]);

        this.vm.htmlAdapter.smsBalance = purchaseValue.purchaseCount - spentValue.spentCount;

        this.vm.htmlAdapter.selectedModeOfPayment = this.vm.htmlAdapter.modeOfPaymentList[0];

        this.vm.htmlAdapter.isInitialLoading = false;

    }

    async makeSmsPurchase(noOfSMS: number, email: string) {
        // Data Validation Starts
        if (noOfSMS <= 0) {
            alert('Invalid SMS Count');
            return;
        }

        // Data Validation Ends

        // Showing loading screen
        this.vm.htmlAdapter.isLoading = true;

        // New SMS Purchase Order Starts
        const currentRedirectParams = new URLSearchParams(location.search);
        const frontendReturnUrlParams = new URLSearchParams();

        // redirect_to params decides the frontend page and state at which the user is redirected after payment
        frontendReturnUrlParams.append('redirect_to', location.origin + location.pathname + '?' + currentRedirectParams.toString());

        const smsPurchase = {
            numberOfSMS: noOfSMS,
            price: this.vm.htmlAdapter.getPrice(noOfSMS),
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const smsPurchaseOrder = {
            parentSchool: this.vm.user.activeSchool.dbId,
            smsPurchaseData: smsPurchase,
        };

        const newOrder = {
            orderAmount: this.vm.htmlAdapter.getPrice(noOfSMS),
            customerName: this.vm.user.activeSchool.name,
            customerPhone: this.vm.user.username,
            customerEmail: this.vm.htmlAdapter.email,
            returnData: {
                origin: environment.DJANGO_SERVER,  // backend url api which will be hit by easebuzz to verify the completion of payment on their portal
                searchParams: frontendReturnUrlParams.toString()
            },
            orderNote: `sms purchase for school with KID ${this.vm.user.activeSchool.dbId}`,
            smsPurchaseOrderList: [smsPurchaseOrder],
            paymentMode: this.vm.htmlAdapter.selectedModeOfPayment,
            orderTotalAmount: this.vm.htmlAdapter.getTotalAmount(this.vm.htmlAdapter.selectedModeOfPayment)
        };

        const newOrderResponse: any = await this.vm.paymentService.createObject(this.vm.paymentService.easebuzz_order_self, newOrder);
        if (newOrderResponse.success) {
            this.vm.htmlAdapter.isLoading = false;
            window.location.href = newOrderResponse.success;
        } else {
            this.vm.htmlAdapter.isLoading = false;
            alert("Unable to initiate payment request.");
        }
    }

}