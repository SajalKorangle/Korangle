import {ManageSmsidComponent} from './manage-smsid.component';

export class ManageSmsidServiceAdapter {

    vm: ManageSmsidComponent;

    constructor() { }

    initialize(vm: ManageSmsidComponent): void {
        this.vm = vm;
    }

}
