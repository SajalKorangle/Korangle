import { AddViaExcelComponent } from './add-via-excel.component';
import { MatDialog } from '@angular/material/dialog';
import { DataLossWarningModalComponent } from './modals/data-loss-warning/data-loss-warning-modal.component';

export class AddViaExcelUploadSheetAdapter {

    vm: AddViaExcelComponent;

    reader: FileReader = new FileReader();

    constructor(
        public dialog: MatDialog
    ) { }

    initializeAdapter(vm: AddViaExcelComponent): void {

        this.vm = vm;

        // Starts :- Initialize on load function of reader variable
        this.reader.onload = (e: any) => {
            if (this.vm.tableAdapter.excelDataFromUser.length > 0) {
                this.openDataLossWarningDialog(e);
            } else {
                this.vm.tableAdapter.readExcelFile(e);
            }
        };
        // Ends :- Initialize on load function of reader variable

    }

    // Starts :- Upload Excel File
    uploadSheet(event: any): void {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.reader.readAsBinaryString(file);
        }
    }
    // Ends :- Upload Excel File

    // Starts: Open Data Loss Warning Dialog when 
    openDataLossWarningDialog(e: any) {

        const dialogRef = this.dialog.open(DataLossWarningModalComponent);

        // Starts :- on closing of modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.action) {
                let action = data.action;
                if (action == "continue") {
                    this.vm.tableAdapter.readExcelFile(e);
                }
            }
        });
        // Ends :- on closing of modal.

    }
    //  Ends: openDataLossWarningDialog

}
