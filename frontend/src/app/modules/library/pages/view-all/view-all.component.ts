import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
    providers: [ ],
})

export class ViewAllComponent implements OnInit {

    user: any;

    constructor () { }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

    }
}
