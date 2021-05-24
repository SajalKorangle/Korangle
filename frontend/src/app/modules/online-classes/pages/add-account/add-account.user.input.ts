import { AddAccountComponent } from './add-account.component';

export class AddAccountUserInput {

    newUsername: string = '';
    newPassword: string = '';
    parentEmployeeForAccountInfo: number;

    selectedAccountInfo: any = null;

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
        this.parentEmployeeForAccountInfo = this.vm.user.activeSchool.employeeId;
    }

}
