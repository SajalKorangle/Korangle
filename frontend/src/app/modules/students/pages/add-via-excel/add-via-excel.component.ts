import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';

import { AddViaExcelServiceAdapter } from './add-via-excel.service.adapter';
import { AddViaExcelHtmlAdapter } from './add-via-excel.html.adapter';


@Component({
  selector: 'app-add-via-excel',
  templateUrl: './add-via-excel.component.html',
  styleUrls: ['./add-via-excel.component.css'],
})
export class AddViaExcelComponent implements OnInit {

    user;

    serviceAdapter: AddViaExcelServiceAdapter;
    htmlAdapter: AddViaExcelHtmlAdapter;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.htmlAdapter = new AddViaExcelHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);

        this.serviceAdapter = new AddViaExcelServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

}
