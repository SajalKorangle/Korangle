import { Component, OnInit } from '@angular/core';

import { DataStorage } from '../../../../classes/data-storage';

import { UpdateViaExcelServiceAdapter } from './update-via-excel.service.adapter';
import { UpdateViaExcelHtmlAdapter as UpdateViaExcelHtmlAdapter } from './update-via-excel.html.adapter';


@Component({
  selector: 'app-update-via-excel',
  templateUrl: './update-via-excel.component.html',
  styleUrls: ['./update-via-excel.component.css'],
})
export class UpdateViaExcelComponent implements OnInit {

    user;

    serviceAdapter: UpdateViaExcelServiceAdapter;
    htmlAdapter: UpdateViaExcelHtmlAdapter;

    constructor() { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.htmlAdapter = new UpdateViaExcelHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);

        this.serviceAdapter = new UpdateViaExcelServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

}
