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
        if (
            feeReceiptBookNameToBeAdded === null ||
            feeReceiptBookNameToBeAdded == '' ||
            this.doesNameAlreadyExists() ||
            this.doesReceiptNumberPrefixAlreadyExists()
        ) {
            return true;
        }
        if (this.doesNameAlreadyExists() || this.doesReceiptNumberPrefixAlreadyExists()) {
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
            feeReceiptBook.newName.trim() == '' ||
            this.doesNameAlreadyExists(feeReceiptBook) ||
            this.doesReceiptNumberPrefixAlreadyExists(feeReceiptBook)
        ) {
            return true;
        }
        return false;
    }

    doesNameAlreadyExists(feeReceiptBook: any = null): boolean {

        let nameAlreadyExists = false;

        let id  = feeReceiptBook ? feeReceiptBook.id : null;
        let name = feeReceiptBook ? feeReceiptBook.newName.trim() : this.vm.feeReceiptBookNameToBeAdded.trim();

        this.vm.feeReceiptBookList.every((feeReceiptBook) => {
            if (feeReceiptBook.name === name && feeReceiptBook.id != id) {
                nameAlreadyExists = true;
                return false;
            }
            return true;
        });

        return nameAlreadyExists;

    }

    doesReceiptNumberPrefixAlreadyExists(feeReceiptBook: any = null): boolean {

        let receiptNumberPrefixAlreadyExists = false;

        let id  = feeReceiptBook ? feeReceiptBook.id : null;
        let receiptNumberPrefix = feeReceiptBook ? feeReceiptBook.newReceiptNumberPrefix.trim() : this.vm.feeReceiptBookReceiptNumberPrefixToBeAdded.trim();

        this.vm.feeReceiptBookList.every((feeReceiptBook) => {
            if (feeReceiptBook.receiptNumberPrefix === receiptNumberPrefix && feeReceiptBook.id != id) {
                receiptNumberPrefixAlreadyExists = true;
                return false;
            }
            return true;
        });

        return receiptNumberPrefixAlreadyExists;

    }

}
