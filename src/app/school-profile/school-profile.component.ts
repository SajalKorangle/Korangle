import {Component, Input, OnInit } from '@angular/core';

import { SchoolService } from '../services/school.service';
import {SchoolProfile} from './school-profile';

@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrls: ['./school-profile.component.css'],
    providers: [ SchoolService ],
})

export class SchoolProfileComponent implements OnInit {

    @Input() user;

    isLoading = false;

    // currentSchoolProfile: SchoolProfile;

    currentName: any;
    currentPrintName: any;
    currentRegistrationNumber: any;
    currentDiseCode: any;
    currentAddress: any;
    currentWorkingSession: any;
    selectedWorkingSession: any;

    sessionList: any;

    constructor (private schoolService: SchoolService) { }

    ngOnInit() {
        this.isLoading = true;

        this.currentName = this.user.schoolName;
        this.currentPrintName = this.user.schoolPrintName;
        this.currentRegistrationNumber = this.user.schoolRegistrationNumber;
        this.currentDiseCode = this.user.schoolDiseCode;
        this.currentAddress = this.user.schoolAddress;


        this.schoolService.getSessionList(this.user.jwt).then( sessionList => {
            this.isLoading = false;
            this.sessionList = sessionList;
            this.selectedWorkingSession = this.getSessionFromList(this.user.schoolCurrentSessionDbId);
            this.currentWorkingSession = this.selectedWorkingSession;
        }, error => {
            this.isLoading = false;
        });
    }

    updateSchoolProfile(): void {
        if (this.currentName.length > 15) {
            alert('Name length shouldn\'t be greater than 15');
            return;
        }
        if (this.currentPrintName.length > 30) {
            alert('Print Name length shouldn\'t be greater than 30');
            return;
        }
        let data = {
            'dbId': this.user.schoolDbId,
            'name': this.currentName,
            'printName': this.currentPrintName,
            'registrationNumber': this.currentRegistrationNumber,
            'diseCode': this.currentDiseCode,
            'address': this.currentAddress,
            'currentSessionDbId': this.currentWorkingSession.dbId,
        };
        console.log(data);
        this.isLoading = true;
        this.schoolService.updateSchoolProfile(data, this.user.jwt).then(schoolProfile => {
            this.isLoading = false;
            this.user.schoolName = schoolProfile.name;
            this.user.schoolPrintName = schoolProfile.printName;
            this.user.schoolRegistrationNumber = schoolProfile.registrationNumber;
            this.user.schoolDiseCode = schoolProfile.diseCode;
            this.user.schoolAddress = schoolProfile.address;
            this.user.schoolCurrentSessionDbId = schoolProfile.currentSessionDbId;
            this.selectedWorkingSession = this.getSessionFromList(schoolProfile.currentSessionDbId);
            alert('School Profile updated successfully');
        }, error => {
            this.isLoading = false;
        })
    }

    getSessionFromList(dbId: number): any {
        let resultSession = null;
        this.sessionList.every(session => {
            if (dbId === session.dbId) {
                resultSession = session;
                return false;
            }
            return true;
        });
        return resultSession;
    }

}
