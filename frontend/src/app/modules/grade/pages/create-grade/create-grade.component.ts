import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { CreateGradeServiceAdapter } from './create-grade.service.adapter';
import { GradeService } from '../../../../services/modules/grade/grade.service';

@Component({
    selector: 'app-create-grade',
    templateUrl: './create-grade.component.html',
    styleUrls: ['./create-grade.component.css'],
    providers: [GradeService],
})
export class CreateGradeComponent implements OnInit {
    user;

    isLoading = true;

    serviceAdapter: CreateGradeServiceAdapter;

    gradeList = [];
    subGradeList = [];
    newGradeName: any; //For New Grade Name
    newSubGradeName: any; //For New SubGrade Name
    subGradeNameToBeAdded: any; //To Update SubGrade Name

    isGradeGettingAdded = false; //Boolean If Grade is Getting Added Or Not

    whichGradeIsUpdated = null; //Used when Grade is deleted or its name is changed

    gradeToWhichSubGradeIsAdded = null; //Used to track to which grade new subgrade is getting added
    whichSubGradeIsUpdated = null; //Used when Sub-Grade is deleted or its name is changed

    constructor(public gradeService: GradeService) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new CreateGradeServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    isGradeUpdateDisabled(grade: any) {
        if (grade.newName == grade.name || this.isThisGradeGettingUpdated(grade)) {
            return true;
        }
        return false;
    }

    isThisGradeGettingUpdated(grade: any) {
        if (this.whichGradeIsUpdated == null) {
            return false;
        }
        if (grade.id == this.whichGradeIsUpdated.id) {
            return true;
        }
    }

    // To check if sub grade update is disabled or enbled
    isSubgradeUpdateDisabled(subgrade: any) {
        if (subgrade.newName == subgrade.name || this.isThisSubGradeGettingUpdated(subgrade)) {
            return true;
        }
        return false;
    }

    // To make input text box empty after sub grade has been added
    isNewSubGradeAdded(grade: any) {
        if (this.isNewSubGradeGettingUpdated(grade) == false) {
            return '';
        }
    }

    isNewSubGradeGettingUpdated(grade: any) {
        if (this.gradeToWhichSubGradeIsAdded == null) {
            return false;
        }
        if (grade.id == this.gradeToWhichSubGradeIsAdded.id) {
            return true;
        }
    }

    isThisSubGradeGettingUpdated(subGrade: any) {
        if (this.whichSubGradeIsUpdated == null) {
            return false;
        }
        if (subGrade.id == this.whichSubGradeIsUpdated.id) {
            return true;
        }
    }
}
