import { Component, Input, OnInit } from '@angular/core';

import { MEDIUM_LIST } from '../../../../classes/constants/medium';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from '../../../../services/modules/school/school.service';
import { GenericService } from '@services/generic/generic-service';
import { SchoolOldService } from '../../../../services/modules/school/school-old.service';

@Component({
    selector: 'update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.css'],
    providers: [
        SchoolOldService,
        SchoolService,
        GenericService,
    ],
})
export class UpdateProfileComponent implements OnInit {
    user;

    mediumList = MEDIUM_LIST;

    isLoading = false;

    currentName: any;
    currentPrintName: any;
    currentMobileNumber: any;
    currentRegistrationNumber: any;
    currentAffiliationNumber: any;
    currentMedium: any;
    currentDiseCode: any;
    currentAddress: any;
    currentOpacity: any;

    currentPincode: any;
    currentVillageCity: any;
    currentBlock: any;
    currentDistrict: any;
    currentState: any;

    currentWorkingSession: any;
    selectedWorkingSession: any;

    sessionList: any;
    boardList: any;

    constructor(
        private schoolOldService: SchoolOldService,
        private schoolService: SchoolService,
        private genericService: GenericService,
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.isLoading = true;

        this.currentName = this.user.activeSchool.name;
        this.currentPrintName = this.user.activeSchool.printName;
        this.currentMobileNumber = this.user.activeSchool.mobileNumber;
        this.currentRegistrationNumber = this.user.activeSchool.registrationNumber;
        this.currentAffiliationNumber = this.user.activeSchool.affiliationNumber;
        this.currentMedium = this.user.activeSchool.medium;
        this.currentDiseCode = this.user.activeSchool.diseCode;
        this.currentAddress = this.user.activeSchool.address;
        this.currentOpacity = this.user.activeSchool.opacity;

        this.currentPincode = this.user.activeSchool.pincode;
        this.currentVillageCity = this.user.activeSchool.villageCity;
        this.currentBlock = this.user.activeSchool.block;
        this.currentDistrict = this.user.activeSchool.district;
        this.currentState = this.user.activeSchool.state;

        this.genericService.getObjectList({school_app: 'Session'}, {}).then(
            (sessionList) => {
                this.isLoading = false;
                this.sessionList = sessionList;
                this.selectedWorkingSession = this.getSessionFromList(this.user.activeSchool.currentWorkingSessionDbId);
                this.currentWorkingSession = this.selectedWorkingSession;
            },
            (error) => {
                this.isLoading = false;
            }
        );

        this.schoolService.getObjectList(this.schoolService.board, {}).then((value) => {
            this.boardList = value;
        });
    }

    updateSchoolProfile(): void {
        if (this.currentName.trim().length == 0) {
            alert("Name shouldn't be empty");
            return;
        }
        if (this.currentName.length > 15) {
            alert("Name length shouldn't be greater than 15");
            return;
        }
        if (this.currentMobileNumber.toString().length !== 10) {
            alert("Mobile number should be of 10 digits!");
            return;
        }
        if (this.currentPrintName.trim().length == 0) {
            alert("Print Name shouldn't be empty");
            return;
        }
        /*if (this.currentPrintName.length > 30) {
            alert("Print Name length shouldn't be greater than 30");
            return;
        }*/
        let data = {
            dbId: this.user.activeSchool.dbId,
            name: this.currentName,
            printName: this.currentPrintName,
            mobileNumber: this.currentMobileNumber,
            registrationNumber: this.currentRegistrationNumber,
            affiliationNumber: this.currentAffiliationNumber,
            medium: this.currentMedium,
            diseCode: this.currentDiseCode,
            address: this.currentAddress,
            opacity: this.currentOpacity,
            currentSessionDbId: this.currentWorkingSession.id,
            pincode: this.currentPincode,
            villageCity: this.currentVillageCity,
            block: this.currentBlock,
            district: this.currentDistrict,
            state: this.currentState,
        };
        console.log(data);
        this.isLoading = true;
        this.schoolOldService.updateSchoolProfile(data, this.user.jwt).then(
            (schoolProfile) => {
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
                this.user.activeSchool.currentWorkingSessionDbId = schoolProfile.currentSessionDbId;

                this.user.activeSchool.pincode = schoolProfile.pincode;
                this.user.activeSchool.villageCity = schoolProfile.villageCity;
                this.user.activeSchool.block = schoolProfile.block;
                this.user.activeSchool.district = schoolProfile.district;
                this.user.activeSchool.state = schoolProfile.state;

                this.selectedWorkingSession = this.getSessionFromList(schoolProfile.currentSessionDbId);
                alert('School Profile updated successfully');
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    getSessionFromList(dbId: number): any {
        let resultSession = null;
        this.sessionList.every((session) => {
            if (dbId === session.id) {
                resultSession = session;
                return false;
            }
            return true;
        });
        return resultSession;
    }

    resizeImage(file: File, ratio: any): Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                let maxWidth = image.width / ratio;
                let maxHeight = image.height / ratio;

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

                if (sw > (aspectRatio[1] * sh) / aspectRatio[0]) {
                    sx = (sw - (aspectRatio[1] * sh) / aspectRatio[0]) / 2;
                    sw = (aspectRatio[1] * sh) / aspectRatio[0];
                    dw = sw;
                } else if (sh > (aspectRatio[0] * sw) / aspectRatio[1]) {
                    sy = (sh - (aspectRatio[0] * sw) / aspectRatio[1]) / 2;
                    sh = (aspectRatio[0] * sw) / aspectRatio[1];
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
            alert('Image type should be either jpg, jpeg, or png');
            return;
        }

        image = await this.cropImage(image, [1, 1]);

        while (image.size > 512000) {
            image = await this.resizeImage(image, 1.5);
        }

        let data = {
            dbId: this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        this.schoolOldService.uploadProfileImage(image, data, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                alert('Logo Uploaded Successfully');
                if (response.status === 'success') {
                    this.user.activeSchool.profileImage = response.url;
                }
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    async onPrincipalSignatureImageSelect(evt: any) {
        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert('Image type should be either jpg, jpeg, or png');
            return;
        }

        image = await this.cropImage(image, [1, 2]);

        while (image.size > 128000) {
            image = await this.resizeImage(image, 1.5);
        }

        let data = {
            dbId: this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        this.schoolOldService.uploadPrincipalSignatureImage(image, data, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                alert("Principal's signature uploaded Successfully");
                if (response.status === 'success') {
                    this.user.activeSchool.principalSignatureImage = response.url;
                }
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }
}
