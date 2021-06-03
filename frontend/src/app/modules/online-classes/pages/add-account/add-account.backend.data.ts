import { AddAccountComponent } from './add-account.component';
import { valueType } from '@modules/common/in-page-permission';

export class AddAccountBackendData {

    accountInfoList: Array<any> = [];
    inPagePermissionMappedByKey: { [key: string]: valueType; };

    employeeList: Array<any>;

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

}
