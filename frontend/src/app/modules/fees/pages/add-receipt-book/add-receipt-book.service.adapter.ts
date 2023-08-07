import { AddReceiptBookComponent } from './add-receipt-book.component';

export class AddReceiptBookServiceAdapter {
    vm: AddReceiptBookComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: AddReceiptBookComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {
        let request_fee_type_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        this.vm.isLoading = true;

        let value = await this.vm.genericService.getObjectList(
            {fees_third_app: 'FeeReceiptBook'},
            {
                filter: request_fee_type_data,
                order_by: ['-id']
            }
        );
        this.populateFeeReceiptBookList(value);
        this.vm.isLoading = false;
    }

    populateFeeReceiptBookList(data: any): void {
        this.vm.feeReceiptBookList = data;
        this.vm.feeReceiptBookList.forEach((feeReceiptBook) => {
            feeReceiptBook['newName'] = feeReceiptBook['name'];
            feeReceiptBook['newReceiptNumberPrefix'] = feeReceiptBook['receiptNumberPrefix'];
            feeReceiptBook['newActive'] = feeReceiptBook['active'];
            feeReceiptBook['updating'] = false;
        });
    }

    async createFeeReceiptBook() {

        this.vm.feeReceiptBookNameToBeAdded = this.vm.feeReceiptBookNameToBeAdded.trim();

        if (this.vm.feeReceiptBookNameToBeAdded === null || this.vm.feeReceiptBookNameToBeAdded == '') {
            alert('Name should be populated');
            return;
        }

        if (this.vm.htmlRenderer.doesNameAlreadyExists()) {
            alert('Name already Exists');
            return;
        }

        if (this.vm.htmlRenderer.doesReceiptNumberPrefixAlreadyExists()) {
            alert('Receipt Number Prefix already Exists');
            return;
        }

        this.vm.isLoading = true;

        let data = {
            name: this.vm.feeReceiptBookNameToBeAdded,
            receiptNumberPrefix: this.vm.feeReceiptBookReceiptNumberPrefixToBeAdded,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let value = await this.vm.genericService.createObject({fees_third_app: 'FeeReceiptBook'}, data);

        this.addToFeeReceiptBookList(value);
        this.vm.feeReceiptBookNameToBeAdded = '';
        this.vm.feeReceiptBookReceiptNumberPrefixToBeAdded = '';
        this.vm.isLoading = false;
    }

    addToFeeReceiptBookList(feeReceiptBook: any): void {
        feeReceiptBook['newName'] = feeReceiptBook['name'];
        feeReceiptBook['newReceiptNumberPrefix'] = feeReceiptBook['receiptNumberPrefix'];
        feeReceiptBook['newActive'] = feeReceiptBook['active'];
        feeReceiptBook['updating'] = false;
        this.vm.feeReceiptBookList.splice(0, 0, feeReceiptBook);
    }

    // Update fee receipt book
    async updateFeeReceiptBook(feeReceiptBook: any) {

        feeReceiptBook.newName = feeReceiptBook.newName.trim();

        if (feeReceiptBook.newName === null || feeReceiptBook.newName == '') {
            alert('Name should be populated');
            return;
        }

        if (this.vm.htmlRenderer.doesNameAlreadyExists(feeReceiptBook)) {
            alert('Name already Exists');
            return;
        }

        if (this.vm.htmlRenderer.doesReceiptNumberPrefixAlreadyExists(feeReceiptBook)) {
            alert('Receipt number prefix already Exists');
            return;
        }

        feeReceiptBook.updating = true;

        let data = {
            id: feeReceiptBook.id,
            name: feeReceiptBook.newName,
            receiptNumberPrefix: feeReceiptBook.newReceiptNumberPrefix,
            active: feeReceiptBook.newActive,
            parentSchool: feeReceiptBook.parentSchool,
        };

        let value = await this.vm.genericService.updateObject({fees_third_app: 'FeeReceiptBook'}, data);
        alert('Receipt Book updated successfully');
        feeReceiptBook.name = value.name;
        feeReceiptBook.receiptNumberPrefix = value.receiptNumberPrefix;
        feeReceiptBook.active = value.active;
        feeReceiptBook.updating = false;
    }
}
