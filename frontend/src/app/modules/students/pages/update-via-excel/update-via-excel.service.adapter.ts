import { UpdateViaExcelComponent } from './update-via-excel.component';
import { CommonFunctions } from '@classes/common-functions';
import { Query } from '@services/generic/query';


export class UpdateViaExcelServiceAdapter {
    vm: UpdateViaExcelComponent;

    constructor() { }

    initializeAdapter(vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }
}
