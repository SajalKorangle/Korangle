import {Component, Input, OnInit } from '@angular/core';

import { SchoolService } from '../../../../services/school.service';
import {MEDIUM_LIST} from '../../../../classes/constants/medium';

@Component({
  selector: 'change-session',
  templateUrl: './change-session.component.html',
  styleUrls: ['./change-session.component.css'],
    providers: [ SchoolService ],
})

export class ChangeSessionComponent implements OnInit {

    @Input() user;

    mediumList = MEDIUM_LIST;

    isLoading = false;

    currentName: any;
    currentPrintName: any;
    currentMobileNumber: any;
    currentRegistrationNumber: any;
    currentAffiliationNumber: any
    currentMedium: any;
    currentDiseCode: any;
    currentAddress: any;
    currentOpacity: any;

    currentWorkingSession: any;
    selectedWorkingSession: any;

    sessionList: any;

    constructor (private schoolService: SchoolService) { }

    ngOnInit() {
        this.isLoading = true;
        console.log('hello');
        this.currentName = this.user.activeSchool.name;
        this.currentPrintName = this.user.activeSchool.printName;
        this.currentMobileNumber = this.user.activeSchool.mobileNumber;
        this.currentRegistrationNumber = this.user.activeSchool.registrationNumber;
        this.currentAffiliationNumber = this.user.activeSchool.affiliationNumber;
        this.currentMedium = this.user.activeSchool.medium;
        this.currentDiseCode = this.user.activeSchool.diseCode;
        this.currentAddress = this.user.activeSchool.address;
        this.currentOpacity = this.user.activeSchool.opacity;


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
            'affiliationNumber': this.currentAffiliationNumber,
            'medium': this.currentMedium,
            'diseCode': this.currentDiseCode,
            'address': this.currentAddress,
            'opacity': this.currentOpacity,
            'currentSessionDbId': this.currentWorkingSession.dbId,
        };
        this.isLoading = true;
        this.schoolService.updateSchoolProfile(data, this.user.jwt).then(schoolProfile => {
            this.isLoading = false;
            this.user.activeSchool.name = schoolProfile.name;
            this.user.activeSchool.printName = schoolProfile.printName;
            this.user.activeSchool.mobileNumber = schoolProfile.mobileNumber;
            this.user.activeSchool.registrationNumber = schoolProfile.registrationNumber;
            this.user.activeSchool.affiliationNumber = schoolProfile.affiliationNumber;
            this.user.activeSchool.medium = schoolProfile.medium;
            this.user.activeSchool.diseCode = schoolProfile.diseCode;
            this.user.activeSchool.address = schoolProfile.address;
            this.user.activeSchool.opacity = schoolProfile.opacity;
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

    /*async onImageSelect(evt: any) {
        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert("Image type should be either jpg, jpeg, or png");
            return;
        }

        while (image.size > 512000) {
            image = await this.resizeImage(image, 1.5);
        }

        if (image.size > 512000) {
            alert('Image size should be less than 512kb');
            return;
        }

        let data = {
            id: this.selectedStudent.dbId,
        };
        this.isLoading = true;
        this.studentService.uploadProfileImage(image, data, this.user.jwt).then( response => {
            this.isLoading = false;
            alert(response.message);
            if (response.status === 'success') {
                this.selectedStudent.profileImage = response.url + '?random+\=' + Math.random();
            }
        }, error => {
            this.isLoading = false;
        });
    }*/

    resizeImage(file:File, ratio: any): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                let maxWidth = image.width/ratio;
                let maxHeight = image.height/ratio;

                let newWidth;
                let newHeight;

                if (width > height) {
                    newHeight = height * (maxWidth / width);
                    newWidth = maxWidth;
                } else {
                    newWidth = width * (maxHeight / height);
                    newHeight = maxHeight;
                }

                let canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;

                let context = canvas.getContext('2d');

                context.drawImage(image, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, file.type);
            };
            image.onerror = reject;
        });
    }

    cropImage(file: File, aspectRatio: any): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {

                let dx = 0;
                let dy = 0;
                let dw = image.width;
                let dh = image.height;

                let sx = 0;
                let sy = 0;
                let sw = dw;
                let sh = dh;

                if (sw > (aspectRatio[1]*sh/aspectRatio[0])) {
                    sx = (sw - (aspectRatio[1]*sh/aspectRatio[0]))/2;
                    sw = (aspectRatio[1]*sh/aspectRatio[0]);
                    dw = sw;
                } else if (sh > (aspectRatio[0]*sw/aspectRatio[1])) {
                    sy = (sh - (aspectRatio[0]*sw/aspectRatio[1]))/2;
                    sh = (aspectRatio[0]*sw/aspectRatio[1]);
                    dh = sh;
                }

                let canvas = document.createElement('canvas');
                canvas.width = dw;
                canvas.height = dh;

                let context = canvas.getContext('2d');

                context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

                canvas.toBlob(resolve, file.type);
            };
            image.onerror = reject;
        });
    }

    async onProfileImageSelect(evt: any) {

        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert("Image type should be either jpg, jpeg, or png");
            return;
        }

        image = await this.cropImage(image, [1,1]);

        while (image.size > 512000) {
            image = await this.resizeImage(image, 1.5);
        }

        let data = {
            dbId: this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        this.schoolService.uploadProfileImage(image, data, this.user.jwt).then( response => {
            this.isLoading = false;
            alert('Logo Uploaded Successfully');
            if (response.status === 'success') {
                this.user.activeSchool.profileImage = response.url;
            }
        }, error => {
            this.isLoading = false;
        });

    }

    async onPrincipalSignatureImageSelect(evt: any) {

        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert("Image type should be either jpg, jpeg, or png");
            return;
        }

        image = await this.cropImage(image, [1,2]);

        while (image.size > 128000) {
            image = await this.resizeImage(image, 1.5);
        }

        let data = {
            dbId: this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        this.schoolService.uploadPrincipalSignatureImage(image, data, this.user.jwt).then( response => {
            this.isLoading = false;
            alert('Principal\'s signature uploaded Successfully');
            if (response.status === 'success') {
                this.user.activeSchool.principalSignatureImage = response.url;
            }
        }, error => {
            this.isLoading = false;
        });

    }

}
