import { AddViaExcelComponent } from './add-via-excel.component';
import { MatDialog } from '@angular/material/dialog';
import { DataLossWarningModalComponent } from './modals/data-loss-warning/data-loss-warning-modal.component';

export class AddViaExcelUploadSheetAdapter {

    vm: AddViaExcelComponent;

    reader: FileReader = new FileReader();

    chosenFileName = "No File Chosen";

    isFileLoading = false;

    constructor(
        public dialog: MatDialog
    ) { }

    initializeAdapter(vm: AddViaExcelComponent): void {

        this.vm = vm;

        // Starts :- Initialize on load function of reader variable
        this.reader.onload = (file: any) => {
            this.isFileLoading = true;
            this.vm.tableAdapter.readExcelFile(file);
            this.isFileLoading = false;
        };
        // Ends :- Initialize on load function of reader variable

    }

    // Starts :- Click Input file button to choose file from computer
    clickInputFileButton(): void {
        let inputFileButton = this.vm.elRef.nativeElement.querySelector('#input-file-button');
        inputFileButton.click();
    }
    // Ends :- Click Input file button to choose file from computer

    // Starts :- Upload Excel File
    uploadSheet(event: any): void {

        if (event.target.files.length > 0) {

            let file = event.target.files[0];
            if (this.vm.tableAdapter.excelDataFromUser.length > 0) {
                this.openDataLossWarningDialog(file);
            } else {
                this.reader.readAsBinaryString(file);
                this.chosenFileName = file.name;
            }

        }

        event.target.value = null;

    }
    // Ends :- Upload Excel File

    // Starts: Open Data Loss Warning Dialog when
    openDataLossWarningDialog(file: any) {

        const dialogRef = this.dialog.open(DataLossWarningModalComponent);

        // Starts :- on closing of modal.
        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.action) {
                let action = data.action;
                if (action == "continue") {
                    this.reader.readAsBinaryString(file);
                    this.chosenFileName = file.name;
                }
            }
        });
        // Ends :- on closing of modal.

    }
    //  Ends: openDataLossWarningDialog

}
