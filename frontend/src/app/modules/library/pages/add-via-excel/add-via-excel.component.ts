import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'add-via-excel',
    templateUrl: './add-via-excel.component.html',
    styleUrls: ['./add-via-excel.component.css'],
    providers: [ ],
})

export class AddViaExcelComponent implements OnInit {

    user: any;

    constructor () { }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

    }
}
