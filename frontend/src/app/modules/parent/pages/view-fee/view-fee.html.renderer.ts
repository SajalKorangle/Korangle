import { ViewFeeComponent } from './view-fee.component';
import { PaymentDailogComponent } from './components/payment-dailog/payment-dailog.component';
import { PaymentResponseDialogComponent } from './components/payment-response-dialog/payment-response-dialog.component';
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

        paymentDialog.afterClosed().subscribe((data) => {
            if (data && data.amountMappedByStudntId && data.newSubFeeReceiptListMappedByStudntId && data.email) {
                this.vm.serviceAdapter.initiatePayment(data.amountMappedByStudntId, data.newSubFeeReceiptListMappedByStudntId, data.email);
            }
        });
    }

    openPaymentResponseDialog() {
        this.vm.dialog.open(PaymentResponseDialogComponent, {
            data: {
                vm: this.vm
            }
        });
    }

}