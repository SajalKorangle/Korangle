import { Constants } from '@classes/constants';
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
        if (noOfSMS <= 0) {
            alert('Invalid SMS Count');
            return;
        }

        if (!this.vm.user.email)
            this.updateUserEmail(email);

        const returnUrl = new URL(
            environment.DJANGO_SERVER + Constants.api_version + this.vm.paymentService.module_url + this.vm.paymentService.order_completion);

        const redirectParams = new URLSearchParams(location.search);

        // redirect_to params decides the prontend page and state at which the user is redirected after payment
        returnUrl.searchParams.append('redirect_to', location.origin + location.pathname + '?' + redirectParams.toString());

        const newOrder = {
            orderAmount: this.getPrice(noOfSMS),
            customerName: this.vm.user.activeSchool.name,
            customerPhone: this.vm.user.username,
            customerEmail: this.vm.email,
            returnUrl: returnUrl.toString(),
            orderNote: `payment towards sms purchase for school with KID ${this.vm.user.activeSchool.dbId}`
        };

        const newOrderResponse = await this.vm.paymentService.createObject(this.vm.paymentService.order_self, newOrder);

        const smsPurchase = {
            numberOfSMS: noOfSMS,
            price: this.getPrice(noOfSMS),
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const onlineSmsPaymentTransaction = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentOrder: newOrderResponse.orderId,
            smsPurchaseJSON: smsPurchase,
        };

        const onlineSmsPaymentTransactionResponse =
            this.vm.smsService.createObject(this.vm.smsService.online_sms_payment_transaction, onlineSmsPaymentTransaction);
        if (!onlineSmsPaymentTransactionResponse)
            return;

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

    }
}