import { AddTransactionComponent } from './add-transaction.component';

export class AddTransactionBackendData {

    accountSessionList: any;
    accountList: any;

    vm: AddTransactionComponent;
    constructor() {}

    initializeData(vm: AddTransactionComponent): void {
        this.vm = vm;
    }

}
