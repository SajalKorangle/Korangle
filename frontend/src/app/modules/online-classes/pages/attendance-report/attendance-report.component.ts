import { Component, OnInit } from '@angular/core';

import { DataStorage } from "@classes/data-storage";

import { AttendanceReportServiceAdapter } from './attendance-report.service.adapter';
import { AttendanceReportHtmlRenderer } from './attendance-report.html.renderer';

@Component({
    selector: 'attendance-report',
    templateUrl: './attendance-report.component.html',
    styleUrls: ['./attendance-report.component.css'],
    providers: [ ],
})

export class AttendanceReportComponent implements OnInit {

    user: any;

    serviceAdapter: AttendanceReportServiceAdapter;
    htmlRenderer: AttendanceReportHtmlRenderer;

    userInput = {};
    backendData = {};
    stateKeeper = { isLoading: false };
    

    constructor () { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.htmlRenderer = new AttendanceReportHtmlRenderer();
        this.htmlRenderer.initialize(this);

        this.serviceAdapter = new AttendanceReportServiceAdapter();
        this.serviceAdapter.initialize(this);

    }
}
