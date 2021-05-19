import {AddAccountComponent} from './add-account.component';

export class AddAccountBackendData {

    accountInfoList: Array<any> = [];

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

}
