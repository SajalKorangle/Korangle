import {Component, Input, OnInit } from '@angular/core';

import { SchoolService } from '../../../../services/school.service';

@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
    providers: [ SchoolService ],
})

export class UpdateProfileComponent implements OnInit {

    @Input() user;

    isLoading = false;

    currentName: any;
    currentPrintName: any;
    currentMobileNumber: any;
    currentRegistrationNumber: any;
    currentDiseCode: any;
    currentAddress: any;
    currentWorkingSession: any;
    selectedWorkingSession: any;

    sessionList: any;

    constructor (private schoolService: SchoolService) { }

    ngOnInit() {
        this.isLoading = true;

        this.currentName = this.user.activeSchool.name;
        this.currentPrintName = this.user.activeSchool.printName;
        this.currentMobileNumber = this.user.activeSchool.mobileNumber;
        this.currentRegistrationNumber = this.user.activeSchool.registrationNumber;
        this.currentDiseCode = this.user.activeSchool.diseCode;
        this.currentAddress = this.user.activeSchool.address;


        this.schoolService.getSessionList(this.user.jwt).then( sessionList => {
            this.isLoading = false;
            this.sessionList = sessionList;
            this.selectedWorkingSession = this.getSessionFromList(this.user.activeSchool.currentSessionDbId);
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
            'dbId': this.user.activeSchool.dbId,
            'name': this.currentName,
            'printName': this.currentPrintName,
            'mobileNumber': this.currentMobileNumber,
            'registrationNumber': this.currentRegistrationNumber,
            'diseCode': this.currentDiseCode,
            'address': this.currentAddress,
            'currentSessionDbId': this.currentWorkingSession.dbId,
        };
        console.log(data);
        this.isLoading = true;
        this.schoolService.updateSchoolProfile(data, this.user.jwt).then(schoolProfile => {
            this.isLoading = false;
            this.user.activeSchool.name = schoolProfile.name;
            this.user.activeSchool.printName = schoolProfile.printName;
            this.user.activeSchool.mobileNumber = schoolProfile.mobileNumber;
            this.user.activeSchool.registrationNumber = schoolProfile.registrationNumber;
            this.user.activeSchool.diseCode = schoolProfile.diseCode;
            this.user.activeSchool.address = schoolProfile.address;
            this.user.activeSchool.currentSessionDbId = schoolProfile.currentSessionDbId;
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
