import { EditGroupDialogComponent } from './edit-group-dialog.component';

export class EditGroupDialogHtmlRenderer {

    vm: EditGroupDialogComponent;
    constructor() {}

    initialize(vm: EditGroupDialogComponent) { this.vm = vm; }

    isAccountNameAlreadyExists(): boolean {
        return this.vm.data.vm.backendData.accountsList.find(account => {
            return account.title.trim() == this.vm.group.title.trim() && account.id != this.vm.group.parentAccount;
        }) != undefined;
    }

    isAddButtonDisplayed(): boolean {
        return this.vm.group.title.trim().length > 0
         && (this.vm.group.parentHead != null || this.vm.group.parentGroup != null)
         && !this.isAccountNameAlreadyExists();
    }

}
