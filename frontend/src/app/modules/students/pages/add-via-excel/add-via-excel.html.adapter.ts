import { AddViaExcelComponent } from './add-via-excel.component';

export class AddViaExcelHtmlAdapter {

    vm: AddViaExcelComponent;

    isLoading = false;
    
    constructor( ) { }

    initializeAdapter(vm: AddViaExcelComponent): void {

        this.vm = vm;

    }

}
