import { AddViaExcelComponent } from './add-via-excel.component';

import xlsx = require('xlsx');
import { MapHeadersModalComponent } from './modals/map-headers-modal/map-headers-modal.component';

export class AddViaExcelTableAdapter {

    vm: AddViaExcelComponent;

    excelDataFromUser = [];

    tableData = [];

    constructor() { }

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
        this.tableData = [];
        // Ends :- Clear previous excel table data, so that fresh data can be populated

        /* save data */
        this.excelDataFromUser = xlsx.utils.sheet_to_json(ws, { header: 1 });

        this.populateTableData();

        this.vm.htmlAdapter.isLoading = false;
    }
    // Ends: Reading Excel File

    populateTableData(): void {

        this.tableData.push([]);

        // Starts :- Populating Headers
        this.excelDataFromUser[0].forEach(columnHeader => {
            this.tableData[0].push({
                excelHeaderName: columnHeader,
                softwareColumnHeader: undefined,
            });
        });
        // Ends :- Populating Headers

        // Starts :- Populating Student Rows
        this.excelDataFromUser.slice(1).forEach(studentRow => {
            this.tableData.push(studentRow);
        });
        // Ends :- Populating Student Rows

        // Starts :- Open Map Headers Modal for user to map excel headers to student fields
        const dialogRef = this.vm.dialog.open(MapHeadersModalComponent, {
            data: {
                tableData: this.tableData,
                softwareColumnHeaderList: this.vm.softwareColumnHeaderList,
            }
        });
        // Ends :- Open Map Headers Modal for user to map excel headers to student fields

    }

    getFilteredSoftwareColumnHeaderList(tableColumnHeader: any): any {
        return this.vm.softwareColumnHeaderList.filter((softwareColumnHeader) => {
            return this.tableData[0].find(columnHeader => {
                return tableColumnHeader != columnHeader &&
                    columnHeader.softwareColumnHeader &&
                    columnHeader.softwareColumnHeader.name == softwareColumnHeader.name;
            }) == undefined;
        });
    }

}