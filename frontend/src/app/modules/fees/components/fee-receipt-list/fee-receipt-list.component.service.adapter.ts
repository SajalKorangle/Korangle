import {FeeReceiptListComponent} from '@modules/fees/components/fee-receipt-list/fee-receipt-list-component.component';

export class FeeReceiptListComponentServiceAdapter {

    vm: FeeReceiptListComponent;

    constructor() {
    }

    initializeAdapter(vm: FeeReceiptListComponent): void {
        this.vm = vm;
    }


    cancelFeeReceipt(feeReceipt: any): void {

        this.vm.isLoading = true;

        let fee_receipt_object = {
            'id': feeReceipt.id,
            'cancelled': true,
            'cancelledBy': this.vm.user.activeSchool.employeeId,
            'cancelledRemark': feeReceipt.cancelledRemark,
            'cancelledDateTime': new Date(),
        };

        let student_fee_list = this.vm.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
        }).map(item => {
            let tempObject = {
                'id': item.parentStudentFee,
                'cleared': false,
            };
            this.vm.installmentList.forEach(installment => {
                if (item[installment + 'Amount'] && item[installment + 'Amount'] > 0) {
                    tempObject[installment + 'ClearanceDate'] = null;
                }
            });
            return tempObject;
        });

        const serviceList = [
            this.vm.feeService.partiallyUpdateObject(this.vm.feeService.fee_receipts, fee_receipt_object),
            this.vm.feeService.partiallyUpdateObjectList(this.vm.feeService.student_fees, student_fee_list),
        ]

        if (feeReceipt.parentTransaction) {
            const transaction_delete_request = {
                id: feeReceipt.parentTransaction,
            }
            serviceList.push(
                this.vm.accountsService.deleteObject(this.vm.accountsService.transaction, transaction_delete_request)
            );
        }

        Promise.all(serviceList).then(value => {

            alert('Fee Receipt is cancelled');
            
            Object.assign(this.vm.feeReceiptList.find(t => t.id === feeReceipt.id), JSON.parse(JSON.stringify(value[0])));
            this.vm.isLoading = false;
            this.vm.receiptCancelled.emit();
        }, error => {
            this.vm.isLoading = false;
        });

    }
}
