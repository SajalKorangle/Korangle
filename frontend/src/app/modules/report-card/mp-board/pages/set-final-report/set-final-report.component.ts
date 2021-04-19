import { Component, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../../services/modules/examination/examination-old.service';
import { ExaminationService } from '../../../../../services/modules/examination/examination.service';

import { SetFinalReportServiceAdapter } from './set-final-report.service.adapter';
import { REPORT_CARD_TYPE_LIST } from '../../classes/constants';

import { ChangeDetectorRef } from '@angular/core';
import { DataStorage } from '../../../../../classes/data-storage';

@Component({
    selector: 'set-final-report',
    templateUrl: './set-final-report.component.html',
    styleUrls: ['./set-final-report.component.css'],
    providers: [ExaminationOldService, ExaminationService],
})
export class SetFinalReportComponent implements OnInit {
    user;

    examinationList: any;
    reportCardMapping: any;
    newReportCardMapping: any;

    reportCardTypeList = REPORT_CARD_TYPE_LIST;

    serviceAdapter: SetFinalReportServiceAdapter;

    isLoading = false;

    constructor(
        public examinationOldService: ExaminationOldService,
        public examinationService: ExaminationService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SetFinalReportServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    disableCreateButton(): boolean {
        // For Playgroup - 8th
        if (
            this.newReportCardMapping.parentExaminationJuly != null &&
            this.newReportCardMapping.parentExaminationAugust != null &&
            this.newReportCardMapping.parentExaminationSeptember != null &&
            this.newReportCardMapping.parentExaminationOctober != null &&
            this.newReportCardMapping.parentExaminationHalfYearly != null &&
            this.newReportCardMapping.parentExaminationDecember != null &&
            this.newReportCardMapping.parentExaminationJanuary != null &&
            this.newReportCardMapping.parentExaminationFebruary != null &&
            this.newReportCardMapping.parentExaminationFinal != null
        ) {
            return false;
        }

        // For 9th - 12th
        if (
            this.newReportCardMapping.parentExaminationQuarterlyHigh != null &&
            this.newReportCardMapping.parentExaminationHalfYearlyHigh != null &&
            this.newReportCardMapping.parentExaminationFinalHigh != null
        ) {
            return false;
        }

        return true;
    }
}
