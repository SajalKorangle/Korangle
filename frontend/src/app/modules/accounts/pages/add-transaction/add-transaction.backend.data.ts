import { AddTransactionComponent } from './add-transaction.component';

export class AddTransactionBackendData {

    accountSessionList = [];
    accountList = [];

    approvalList = [];
    approvalAccountDetailsList = [];
    approvalImagesList = [];

    vm: AddTransactionComponent;
    constructor() {}

    initializeData(vm: AddTransactionComponent): void {
        this.vm = vm;
    }

}
