import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'add-book',
    templateUrl: './add-book.component.html',
    styleUrls: ['./add-book.component.css'],
    providers: [ ],
})

export class AddBookComponent implements OnInit {

    user: any;

    constructor () { }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

    }
}
