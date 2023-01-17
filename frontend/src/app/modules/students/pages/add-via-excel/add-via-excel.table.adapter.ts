import { AddViaExcelComponent } from './add-via-excel.component';

import xlsx = require('xlsx');

export class AddViaExcelTableAdapter {

    vm: AddViaExcelComponent;

    excelDataFromUser = [];

    constructor( ) { }

    initializeAdapter(vm: AddViaExcelComponent): void {

        this.vm = vm;

    }

    // Starts: Reading Excel File
    readExcelFile(e: any) {
        this.vm.htmlAdapter.isLoading = true;

        /* read workbook */
        const bstr: string = e.target.result;
        const wb: xlsx.WorkBook = xlsx.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: xlsx.WorkSheet = wb.Sheets[wsname];

        // Starts :- Clear previous excel table data, so that fresh data can be populated
        this.excelDataFromUser = [];
        // Ends :- Clear previous excel table data, so that fresh data can be populated

        /* save data */
        this.excelDataFromUser = xlsx.utils.sheet_to_json(ws, { header: 1 });

        this.vm.htmlAdapter.isLoading = false;
    }
    // Ends: Reading Excel File

}