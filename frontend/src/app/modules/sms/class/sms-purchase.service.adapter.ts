import { environment } from 'environments/environment';
import { SMS_CHARGE } from './constants';

export class GeneralSMSPurchaseServiceAdapter {
    vm: any;
    constructor(vm: any) {
        this.vm = vm;
    }
    getPrice(noOfSMS) {
        return noOfSMS * SMS_CHARGE;
    }

    updateUserEmail(email) {
        const user_email_update_request = {
            'id': this.vm.user.id,
            'email': email,
        };
        this.vm.userService.partiallyUpdateObject(this.vm.userService.user, user_email_update_request);
    }

    async makeSMSPurchase(noOfSMS: number, email: string) {
        // Data Validation Starts
        if (noOfSMS <= 0) {
            alert('Invalid SMS Count');
            return;
        }

        if (!this.vm.user.email)
            this.updateUserEmail(email);

        // Data Validation Ends

        // New SMS Purchase Order Starts

        const returnUrl = new URL(
            environment.DJANGO_SERVER + this.vm.paymentService.module_url + this.vm.paymentService.version_free_api.order_completion + '/');

        const redirectParams = new URLSearchParams(location.search);

        // redirect_to params decides the frontend page and state at which the user is redirected after payment
        returnUrl.searchParams.append('redirect_to', location.origin + location.pathname + '?' + redirectParams.toString());

        const smsPurchase = {
            numberOfSMS: noOfSMS,
            price: this.getPrice(noOfSMS),
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const smsPurchaseOrder = {
            parentSchool: this.vm.user.activeSchool.dbId,
            smsPurchaseData: smsPurchase,
        };

        const newOrder = {
            orderAmount: this.getPrice(noOfSMS),
            customerName: this.vm.user.activeSchool.name,
            customerPhone: this.vm.user.username,
            customerEmail: this.vm.email,
            returnUrl: returnUrl.toString(),
            orderNote: `payment towards sms purchase for school with KID ${this.vm.user.activeSchool.dbId}`,
            smsPurchaseOrderList: [smsPurchaseOrder],
        };

        const newOrderResponse = await this.vm.paymentService.createObject(this.vm.paymentService.order_self, newOrder);
        // New SMS Purchase Order Ends

        // Redirecting to Cashfree Payment Page Starts

        const form = document.createElement('form');

        form.method = 'post';
        form.action = environment.CASHFREE_CHECKOUT_URL;

        Object.entries(newOrderResponse).forEach(([key, value]) => {    // form data to send post req. at cashfree
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = value.toString();

            form.appendChild(hiddenField);
        });

        document.body.appendChild(form);
        form.submit();
        // Redirecting to Cashfree Payment Page Ends

    }
}