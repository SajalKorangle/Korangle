import { Component, Input, OnInit } from '@angular/core';

import { ExaminationService } from '../../../../services/modules/examination/examination.service';

import { CreateExaminationServiceAdapter } from './create-examination.service.adapter';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'create-examination',
    templateUrl: './create-examination.component.html',
    styleUrls: ['./create-examination.component.css'],
    providers: [ExaminationService],
})
export class CreateExaminationComponent implements OnInit {
    user;

    examinationList: any;
    examinationNameToBeAdded = null;
    // examinationStatusToBeAdded = null;

    serviceAdapter: CreateExaminationServiceAdapter;

    isLoading = false;

    constructor(public examinationService: ExaminationService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CreateExaminationServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    isExaminationUpdateDisabled(examination: any): boolean {
        if ((examination.newName == examination.name && 
                examination.newStatus == examination.status && 
                    examination.newMarksUpdationStatus == examination.marksUpdationStatus) || examination.updating) {
            return true;
        }
        return false;
    }
}
