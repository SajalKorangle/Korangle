import { AddViaExcelComponent } from './add-via-excel.component';
import { isMobile } from '@classes/common';

export class AddViaExcelHtmlAdapter {

    vm: AddViaExcelComponent;

    isLoading = false;

    constructor( ) { }

    initializeAdapter(vm: AddViaExcelComponent): void {
        this.vm = vm;
    }

    isMobileDevice(): boolean {
        return isMobile();
    }

}
