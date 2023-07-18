import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'page-name',
    templateUrl: './page-name.component.html',
    styleUrls: ['./page-name.component.css'],
    providers: [ ],
})

export class PageNameComponent implements OnInit {

    user: any;

    constructor () { }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

    }
}
