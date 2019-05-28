
import { CancelFeeReceiptComponent } from './cancel-fee-receipt.component';

export class CancelFeeReceiptServiceAdapter {

    vm: CancelFeeReceiptComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: CancelFeeReceiptComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;
    }

}