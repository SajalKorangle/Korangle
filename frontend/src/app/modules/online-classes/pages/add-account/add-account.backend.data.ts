import { AddAccountComponent } from './add-account.component';
import { valueType } from '@classes/task-settings';

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
