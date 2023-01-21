import { AddViaExcelComponent } from './add-via-excel.component';
import { MatDialog } from '@angular/material/dialog';
import { DataLossWarningModalComponent } from './modals/data-loss-warning/data-loss-warning-modal.component';
import { FilePreviewImageModalComponent } from './modals/file-preview-image-modal/file-preview-image-modal.component';
import { GuidelinesModalComponent } from './modals/guidelines-modal/guidelines-modal.component';

import xlsx = require('xlsx');

export class AddViaExcelUploadSheetAdapter {

    vm: AddViaExcelComponent;

    reader: FileReader = new FileReader();

    chosenFileName = "No File Chosen";

    columnHeaderList = [
        "Student Name",
        "Father's Name",
        "Class",
        "Division",
        "Roll No.",
        "Mobile Number",
        "Alternate Mobile Number",
        "Scholar Number",
        "Date of Birth",
        "Remarks",
        "Mother's Name",
        "Gender",
        "Caste",
        "Category",
        "Religion",
        "Father's Occupation",
        "Address",
        "Family SSMID",
        "Child SSMID",
        "Bank Name",
        "IFSC Code",
        "Bank Account No.",
        "Aadhar Number",
        "Blood Group",
        "Father's Annual Income",
        "Bus Stop",
        "RTE",
        "Admission Session",
        "Admission Class",
        "Date of Admission",
    ];

    currentSessionName: string;

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

    // Starts: Open Sample-File-Image Preview Modal
    openFilePreviewImage(): void {
        const dialogRef = this.dialog.open(FilePreviewImageModalComponent);
    }
    // Ends: Open Sample-File-Image Preview Modal

    // Starts: Open guidline modal
    openGuidelines(): void {
        const dialogRef = this.dialog.open(GuidelinesModalComponent);
    }
    // Ends: Open guidline modal

    // Starts :- Click Input file button to choose file from computer
    clickInputFileButton(): void {
        let inputFileButton = this.vm.elRef.nativeElement.querySelector('#input-file-button');
        inputFileButton.click();
    }
    // Ends :- Click Input file button to choose file from computer

    // Starts :- Upload Excel File
    uploadSheet(event: any): void {

        // Starts: If a file is chosen
        if (event.target.files.length > 0) {

            // Comment: Get the first file if mulitple files are chosen
            let file = event.target.files[0];

            // Starts: Open Data Loss warning modal if some data is already present in the page
            if (this.vm.tableAdapter.excelDataFromUser.length > 0) {
                this.openDataLossWarningDialog(file);
            }
            // Ends: Open Data Loss warning modal if some data is already present in the page

            // Starts: No previous data is displayed, directly go to read the file
            else {
                this.reader.readAsBinaryString(file);
                this.chosenFileName = file.name; // Comment: Last read file name should be displayed to the user.
            }
            // Ends: No previous data is displayed, directly go to read the file

        }
        // Ends: If a file is chosen

        // Comment: Make the target value null so that last file can be chosen again, if wanted.
        event.target.value = null;

    }
    // Ends :- Upload Excel File

    // Starts: Open Data Loss Warning Dialog
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
    // Starts: Open Data Loss Warning Dialog

    // Starts: Download Sheet Template
    downloadSheetTemplate(): void {
        let sheetTemplate = []; // to be downloaded

        sheetTemplate.push(this.columnHeaderList);

        let ws = xlsx.utils.aoa_to_sheet(sheetTemplate);
        let wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
        xlsx.writeFile(wb, 'Sheet.xlsx');
    }
    //  Ends: Download Sheet Template

}
