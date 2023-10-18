import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GenericService } from '@services/generic/generic-service';
import { DataStorage } from "../../../../classes/data-storage";
import { ViewHistoryServiceAdapter } from './view-history.service.adapter';

@Component({
    templateUrl: './view-history.component.html',
    styleUrls: ['./view-history.component.css'],
    providers: [GenericService]
})

export class ViewHistoryComponent implements OnInit {

    // @Input() user;
    user: any;
    serviceAdapter: ViewHistoryServiceAdapter;

    // Loader List
    isInitialLoading: boolean;

    paidBillList = [];

    constructor(
        public dialog: MatDialog,
    ) { }

    // Server Handling - Initial
    ngOnInit(): void {

        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewHistoryServiceAdapter;
        this.serviceAdapter.initialiseAdapter(this);
        this.serviceAdapter.initialiseData();

    }

    downloadFile(billPdfUrl: any) : void {
        console.log(billPdfUrl);
        let link = document.createElement('a');
        link.href = billPdfUrl;
        link.target = '_blank';
        link.dispatchEvent(new MouseEvent('click'));
    }

}