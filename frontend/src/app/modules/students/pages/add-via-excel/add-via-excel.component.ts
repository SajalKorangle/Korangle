import { Component, ElementRef, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';

import { AddViaExcelServiceAdapter } from './add-via-excel.service.adapter';
import { AddViaExcelHtmlAdapter } from './add-via-excel.html.adapter';
import { MatDialog } from '@angular/material/dialog';
import { AddViaExcelUploadSheetAdapter } from './add-via-excel.upload.sheet.adapter';
import { AddViaExcelTableAdapter } from './add-via-excel.table.adapter';


@Component({
  selector: 'app-add-via-excel',
  templateUrl: './add-via-excel.component.html',
  styleUrls: ['./add-via-excel.component.css'],
})
export class AddViaExcelComponent implements OnInit {

    user;

    serviceAdapter: AddViaExcelServiceAdapter;
    htmlAdapter: AddViaExcelHtmlAdapter;
    uploadSheetAdapter: AddViaExcelUploadSheetAdapter;
    tableAdapter: AddViaExcelTableAdapter;

    softwareColumnHeaderList = [
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

    isLoading = false;

    constructor(
        public dialog: MatDialog,
        public elRef: ElementRef,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.htmlAdapter = new AddViaExcelHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);

        this.uploadSheetAdapter = new AddViaExcelUploadSheetAdapter(this.dialog);
        this.uploadSheetAdapter.initializeAdapter(this);

        this.tableAdapter = new AddViaExcelTableAdapter();
        this.tableAdapter.initializeAdapter(this);

        this.serviceAdapter = new AddViaExcelServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

}
