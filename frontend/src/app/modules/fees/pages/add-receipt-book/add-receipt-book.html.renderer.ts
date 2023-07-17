import { AddReceiptBookComponent } from './add-receipt-book.component';

export class AddReceiptBookHtmlRenderer {
    vm: AddReceiptBookComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: AddReceiptBookComponent): void {
        this.vm = vm;
    }

    isAddButtonDisabled(): boolean {
        let feeReceiptBookNameToBeAdded = this.vm.feeReceiptBookNameToBeAdded.trim();
        if (feeReceiptBookNameToBeAdded === null || feeReceiptBookNameToBeAdded == '') {
            return true;
        }
        return false;
    }

    isFeeReceiptBookUpdateDisabled(feeReceiptBook: any): boolean {
        if (
            (
                feeReceiptBook.newName == feeReceiptBook.name &&
                feeReceiptBook.newReceiptNumberPrefix == feeReceiptBook.receiptNumberPrefix &&
                feeReceiptBook.newActive == feeReceiptBook.active
            ) ||
            feeReceiptBook.updating ||
            feeReceiptBook.newName === null ||
            feeReceiptBook.newName == ''
        ) {
            return true;
        }
        return false;
    }

}
