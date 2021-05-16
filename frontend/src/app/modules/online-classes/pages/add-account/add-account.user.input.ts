import { AddAccountComponent } from './add-account.component';

export class AddAccountUserInput {

    newUsername: string = '';
    newPassword: string = '';

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

}
