import { AddViaExcelComponent } from './add-via-excel.component';
import { isMobile } from '@classes/common';


export class AddViaExcelHtmlAdapter {

    vm: AddViaExcelComponent;

    constructor() { }

    initializeAdapter(vm: AddViaExcelComponent): void {
        this.vm = vm;
    }

}
