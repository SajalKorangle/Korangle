import { ManageAccountsComponent } from './manage-accounts.component';

export class ManageAccountsBackendData {
    accountsList = [];

    vm: ManageAccountsComponent;
    constructor() {}

    initialize(vm: ManageAccountsComponent) {
        this.vm = vm;
    }
}
