import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";


@Component({
    selector: 'app-update-book',
    templateUrl: './update-book.component.html',
    styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {

    user: any;

    constructor() { }

    ngOnInit() {

        this.user = DataStorage.getInstance().getUser();

    }

}
