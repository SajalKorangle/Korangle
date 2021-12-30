import { FeeReceiptListComponent } from '@modules/fees/components/fee-receipt-list/fee-receipt-list-component.component';

export class FeeReceiptListComponentServiceAdapter {
    vm: FeeReceiptListComponent;

    constructor() { }

    initializeAdapter(vm: FeeReceiptListComponent): void {
        this.vm = vm;
    }

    cancelFeeReceipt(feeReceipt: any): void {
        this.vm.isLoading = true;

        let fee_receipt_object = {
            id: feeReceipt.id,
            cancelled: true,
            cancelledBy: this.vm.user.activeSchool.employeeId,
            cancelledRemark: feeReceipt.cancelledRemark,
            cancelledDateTime: new Date(),
        };

        Promise.all([
            this.vm.feeService.partiallyUpdateObject(this.vm.feeService.fee_receipts, fee_receipt_object),
        ]).then(
            (value) => {
                alert('Fee Receipt is cancelled');

                Object.assign(
                    this.vm.feeReceiptList.find((t) => t.id === feeReceipt.id),
                    JSON.parse(JSON.stringify(value[0]))
                );
                this.vm.isLoading = false;
                this.vm.receiptCancelled.emit();
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
