import { ViewFeeComponent } from './view-fee.component';
import { PaymentResponseDialogComponent } from './components/payment-response-dialog/payment-response-dialog.component';
export class ViewFeeHTMLRenderer {
    vm: ViewFeeComponent;

    constructor(vm: ViewFeeComponent) {
        this.vm = vm;
    }

    openPaymentResponseDialog() {
        this.vm.dialog.open(PaymentResponseDialogComponent, {
            data: {
                vm: this.vm
            }
        });
    }

}