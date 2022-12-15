import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';

import { MatDialog } from '@angular/material';
import { UpdateViaExcelHtmlRenderer } from './update-via-excel.html.renderer';


@Component({
  selector: 'app-update-via-excel',
  templateUrl: './update-via-excel.component.html',
  styleUrls: ['./update-via-excel.component.css'],
})
export class UpdateViaExcelComponent implements OnInit {
    user;
    NULL_CONSTANT = null;
    isLoading: boolean = false;

    activeTab: string = "download-template";

    reader: FileReader = new FileReader();

    excelDataFromUser: any = [];

    htmlRenderer: UpdateViaExcelHtmlRenderer;

    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new UpdateViaExcelHtmlRenderer();
        this.htmlRenderer.initializeRenderer(this);

        this.isLoading = false;
    }

  /* Set Active Tab */
    setActiveTab(tabName) {
        this.activeTab = tabName;
    }  //  Ends: setActiveTab()
}
