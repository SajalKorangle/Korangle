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
        {
            name: "Student Name",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Father's Name",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Class",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Section",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Roll No.",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Mobile Number",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Alternate Mobile Number",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Scholar Number",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Date of Birth",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Remarks",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Mother's Name",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Gender",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Caste",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Category",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Religion",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Father's Occupation",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Address",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Family SSMID",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Child SSMID",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Bank Name",
            possibleExcelHeaderNameList: []
        },
        {
            name: "IFSC Code",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Bank Account No.",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Aadhar Number",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Blood Group",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Father's Annual Income",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Bus Stop",
            possibleExcelHeaderNameList: []
        },
        {
            name: "RTE",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Admission Session",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Admission Class",
            possibleExcelHeaderNameList: []
        },
        {
            name: "Date of Admission",
            possibleExcelHeaderNameList: []
        },
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
