import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { ViewHistoryServiceAdapter } from './view-history.service.adapter';

@Component({
    selector: 'view-history',
    templateUrl: './view-history.component.html',
    styleUrls: ['./view-history.component.css']
})

export class ViewHistoryComponent implements OnInit {

    // @Input() user;
    user: any;
    serviceAdapter: ViewHistoryServiceAdapter;

    constructor() { }

    // Server Handling - Initial
    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewHistoryServiceAdapter;
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();

    }

}