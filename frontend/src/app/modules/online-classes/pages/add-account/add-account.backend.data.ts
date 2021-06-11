import { AddAccountComponent } from './add-account.component';
import { valueType } from '@modules/common/in-page-permission';
import { AccountInfo } from '@services/modules/online-class/models/account-info';

export class AddAccountBackendData {

    accountInfoList: Array<AccountInfo> = [];
    inPagePermissionMappedByKey: { [key: string]: valueType; };

    employeeList: Array<any>;

    vm: AddAccountComponent;

    constructor() { }

    initialize(vm: AddAccountComponent): void {
        this.vm = vm;
    }

    getEmployeeById(id: number) {
        return this.employeeList.find(e => e.id == id);
    }

}
