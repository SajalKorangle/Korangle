import { AddGroupDialogComponent } from './add-group-dialog.component';

export class AddGroupDialogHtmlRenderer {

    vm: AddGroupDialogComponent;
    constructor() {}

    initialize(vm: AddGroupDialogComponent) { this.vm = vm; }

    isNameAlreadyExists(): boolean {
        return this.vm.data.vm.backendData.accountsList.find(account => {
            return account.title.trim() == this.vm.groupName.trim();
        }) != undefined;
    }

    isAddButtonDisplayed(): boolean {
        return this.vm.groupName.trim().length > 0
         && (this.vm.parentHead != null || this.vm.parentGroup != null)
         && !this.isNameAlreadyExists();
    }

}
