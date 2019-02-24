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

        // For Playgroup - 8th
        if (this.newReportCardMapping.parentExaminationJuly != null
            && this.newReportCardMapping.parentExaminationAugust != null
            && this.newReportCardMapping.parentExaminationSeptember != null
            && this.newReportCardMapping.parentExaminationOctober != null
            && this.newReportCardMapping.parentExaminationHalfYearly != null
            && this.newReportCardMapping.parentExaminationDecember != null
            && this.newReportCardMapping.parentExaminationJanuary != null
            && this.newReportCardMapping.parentExaminationFebruary != null
            && this.newReportCardMapping.parentExaminationFinal != null) {
            return false;
        }

        // For 9th - 12th
        if (this.newReportCardMapping.parentExaminationQuarterlyHigh != null
            && this.newReportCardMapping.parentExaminationHalfYearlyHigh != null
            && this.newReportCardMapping.parentExaminationFinalHigh != null) {
            return false;
        }

        return true;

    }

}
