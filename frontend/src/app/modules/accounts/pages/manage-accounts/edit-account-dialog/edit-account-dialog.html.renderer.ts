import { EditAccountDialogComponent } from './edit-account-dialog.component';

export class EditAccountDialogHtmlRenderer {
    vm: EditAccountDialogComponent;
    constructor() {}

    initialize(vm: EditAccountDialogComponent) {
        this.vm = vm;
    }

    isAccountNameAlreadyExists(): boolean {
        return (
            this.vm.data.vm.backendData.accountsList.find((account) => {
                return account.title.trim() == this.vm.account.title.trim() && account.id != this.vm.account.id;
            }) != undefined
        );
    }

    isAddButtonDisplayed(): boolean {
        return (
            this.vm.account.title.trim().length > 0 &&
            (this.vm.account.parentHead != null || this.vm.account.parentGroup != null) &&
            !this.isAccountNameAlreadyExists()
        );
    }
}
