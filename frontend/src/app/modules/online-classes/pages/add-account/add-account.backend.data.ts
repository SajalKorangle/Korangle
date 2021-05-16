import {AddAccountComponent} from './add-account.component';

export class AddAccountBackendData {

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

}
