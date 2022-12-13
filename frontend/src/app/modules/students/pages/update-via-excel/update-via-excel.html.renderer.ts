import { UpdateViaExcelComponent } from './update-via-excel.component';
import { isMobile } from '@classes/common';


export class UpdateViaExcelHtmlRenderer {

    vm: UpdateViaExcelComponent;

    constructor() { }

    initializeRenderer(vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }
}
