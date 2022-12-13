import { UpdateViaExcelComponent } from './update-via-excel.component';
import { isMobile } from '@classes/common';

// import {
//     DATE_OF_BIRTH,
//     CURRENT_BUS_STOP,
//     DATE_OF_ADMISSION,
//     ADMISSION_CLASS,
//     SECTION,
//     CLASS,
//     ADMISSION_SESSION,
//     CUSTOM_PARAMETER,
// } from './constants/student-properties';


export class UpdateViaExcelHtmlRenderer {

    vm: UpdateViaExcelComponent;

    constructor() { }

    initializeRenderer(vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }
}
