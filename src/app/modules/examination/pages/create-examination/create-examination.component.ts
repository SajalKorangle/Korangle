import { Component, Input, OnInit } from '@angular/core';

import { ExaminationOldService } from '../../../../services/examination-old.service';

import { CreateExaminationServiceAdapter } from './create-examination.service.adapter';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
    selector: 'create-examination',
    templateUrl: './create-examination.component.html',
    styleUrls: ['./create-examination.component.css'],
    providers: [ ExaminationOldService ],
})

export class CreateExaminationComponent implements OnInit {

    user;

    examinationList: any;
    examinationNameToBeAdded = null;
    examinationStatusToBeAdded = null;

    serviceAdapter: CreateExaminationServiceAdapter;

    isLoading = false;

    constructor(public examinationService: ExaminationOldService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CreateExaminationServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    isExaminationUpdateDisabled(examination: any): boolean {
        if ((examination.newName == examination.name
                && examination.newStatus == examination.status)
            || examination.updating) {
            return true;
        }
        return false;
    }

}
