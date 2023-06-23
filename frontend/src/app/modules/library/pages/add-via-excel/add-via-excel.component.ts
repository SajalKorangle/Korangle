import { Component, OnInit } from '@angular/core';
import xlsx = require('xlsx');

import { DataStorage } from "@classes/data-storage";
import { GenericService } from '@services/generic/generic-service';
import { AddViaExcelServiceAdapter } from './add-via-excel.service.adapter';

interface Parameter {
    name: string;
    field: string;
    filter: (any) => boolean;
    required?: boolean;
}

@Component({
    selector: 'add-via-excel',
    templateUrl: './add-via-excel.component.html',
    styleUrls: ['./add-via-excel.component.css'],
    providers: [GenericService],
})

export class AddViaExcelComponent implements OnInit {

    user: any;
    isLoading: boolean = false;

    serviceAdapter: AddViaExcelServiceAdapter;

    usedBookNumbers: Number[] = [];

    parameters: Parameter[] = [
        {
            name: "Book Number",
            field: "bookNumber",
            filter: (num) => {
                if (!num && num !== 0) return false;
                if (this.usedBookNumbers.includes(num)) return false;
                return false;
            },
            required: true
        },
        {
            name: "Book Name",
            field: "name",
            filter: () => true,
            required: true
        },
        {
            name: "Author",
            field: "author",
            filter: () => true
        },
        {
            name: "Publisher",
            field: "publisher",
            filter: () => true
        },
        {
            name: "Date of Purchase",
            field: "dateOfPurchase",
            filter: () => true
        },
        {
            name: "Edition",
            field: "edition",
            filter: () => true
        },
        {
            name: "Number of Pages",
            field: "numberOfPages",
            filter: () => true
        },
        {
            name: "Printed Cost",
            field: "printedCost",
            filter: () => true
        },
        {
            name: "Cover Type",
            field: "coverType",
            filter: () => true
        },
        {
            name: "Type of Book",
            field: "typeOfBook",
            filter: () => true
        },
        {
            name: "Location",
            field: "location",
            filter: () => true
        }
    ];

    constructor (public genericService: GenericService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddViaExcelServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }
}
