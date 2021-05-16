import {AddAccountComponent} from './add-account.component';

export class AddAccountServiceAdapter {

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

}
