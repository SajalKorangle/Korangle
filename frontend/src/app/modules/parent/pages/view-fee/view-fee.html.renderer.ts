import { ViewFeeComponent } from './view-fee.component';
import { PaymentDailogComponent } from './components/payment-dailog/payment-dailog.component';

export class ViewFeeHTMLRenderer {
    vm: ViewFeeComponent;

    constructor(vm: ViewFeeComponent) {
        this.vm = vm;
    }

    openPaymentDialog() {
        const paymentDialog = this.vm.dialog.open(PaymentDailogComponent, {
            data: {
                vm: this.vm
            }
        });
    }

}