import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'manage-type',
    templateUrl: './manage_type.component.html',
    styleUrls: ['./manage_type.component.css'],
    providers: [ ],
})

export class ManageTypeComponent implements OnInit {

    user: any;

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    addNewType($event): void {
        alert("Under Construction");
    }
}
