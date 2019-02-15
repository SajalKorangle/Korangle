import { Component, Input, OnInit } from '@angular/core';

import { ExaminationService } from '../../../../services/examination.service';

import { SetFinalReportServiceAdapter } from './set-final-report.service.adapter';
import {REPORT_CARD_TYPE_LIST} from '../../classes/constants';

import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'set-final-report',
    templateUrl: './set-final-report.component.html',
    styleUrls: ['./set-final-report.component.css'],
    providers: [ ExaminationService ],
})

export class SetFinalReportComponent implements OnInit {

    @Input() user;

    examinationList: any;
    reportCardMapping: any;
    newReportCardMapping: any;

    reportCardTypeList = REPORT_CARD_TYPE_LIST;

    serviceAdapter: SetFinalReportServiceAdapter;

    isLoading = false;

    constructor(public examinationService: ExaminationService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new SetFinalReportServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    disableCreateButton(): boolean {
        let result = false;
        Object.keys(this.newReportCardMapping).every(key => {
            if (key != "id" && this.newReportCardMapping[key] == null) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    disableUpdateButton(): boolean {
        let result = true;
        Object.keys(this.newReportCardMapping).every(key => {
            if (this.newReportCardMapping[key] != this.reportCardMapping[key]) {
                result = false;
                return false;
            }
            return true;
        });
        return result;
    }

}
