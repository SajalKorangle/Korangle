import { Component, OnInit } from '@angular/core';

import { SetFinalReportServiceAdapter } from './set-final-report.service.adapter';

import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from "../../../../../classes/data-storage";
import {ExaminationService} from "../../../../../services/modules/examination/examination.service";
import {ReportCardCbseService} from "../../../../../services/modules/report-card/cbse/report-card-cbse.service";

@Component({
    selector: 'set-final-report',
    templateUrl: './set-final-report.component.html',
    styleUrls: ['./set-final-report.component.css'],
    providers: [ ExaminationService, ReportCardCbseService ],
})

export class SetFinalReportComponent implements OnInit {

    user;

    examinationList: any;
    termList: any;
    reportCardMappingList = [];

    serviceAdapter: SetFinalReportServiceAdapter;

    isLoading = false;

    constructor(public examinationService: ExaminationService,
                public reportCardCbseService: ReportCardCbseService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SetFinalReportServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    getReportCardMapping(term: any): any {
        return this.reportCardMappingList.find(reportCardMapping => {
            return reportCardMapping.parentTerm == term.id;
        });
    }

    disableCreateButton(): boolean {

        let result = false;

        this.reportCardMappingList.every(reportCardMapping => {
            if (!reportCardMapping.parentExaminationPeriodicTest ||
                !reportCardMapping.parentExaminationNoteBook ||
                !reportCardMapping.parentExaminationSubEnrichment ||
                !reportCardMapping.parentExaminationFinalTerm) {
                result = true;
                return false;
            }
        });

        return result;

    }

}
