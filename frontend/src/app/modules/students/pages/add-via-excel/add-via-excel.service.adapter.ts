import { AddViaExcelComponent } from './add-via-excel.component';
import { Query } from '@services/generic/query';


export class AddViaExcelServiceAdapter {
    vm: AddViaExcelComponent;

    constructor() { }

    initializeAdapter(vm: AddViaExcelComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    async initializeData() {
    }
    // Ends: initializeData()

}
