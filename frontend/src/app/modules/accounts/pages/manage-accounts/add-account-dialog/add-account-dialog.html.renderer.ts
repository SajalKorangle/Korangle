import { AddAccountDialogComponent } from './add-account-dialog.component';

export class AddAccountDialogHtmlRenderer {

    vm: AddAccountDialogComponent;
    constructor() {}

    initialize(vm: AddAccountDialogComponent) { this.vm = vm; }

    isAccountNameAlreadyExists(): boolean {
        return this.vm.data.vm.backendData.accountsList.find(account => {
            return account.title.trim() == this.vm.accountName.trim();
        }) != undefined;
    }

    isAddButtonDisplayed(): boolean {
        return this.vm.accountName.trim().length > 0
         && (this.vm.parentHead != null || this.vm.parentGroup != null)
         && !this.isAccountNameAlreadyExists();
    }

}
