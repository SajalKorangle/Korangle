import {AddAccountComponent} from './add-account.component';

export class AddAccountUserInput {

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

}
