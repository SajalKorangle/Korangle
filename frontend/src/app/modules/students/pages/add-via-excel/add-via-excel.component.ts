import { Component, OnInit } from '@angular/core';

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

    constructor(
        public dialog: MatDialog
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
