import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

@Component({
    selector: 'delete-book',
    templateUrl: './delete-book.component.html',
    styleUrls: ['./delete-book.component.css'],
    providers: [ ],
})

export class DeleteBookComponent implements OnInit {

    user: any;

    constructor () { }

    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

    }
}
