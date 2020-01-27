import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../../../classes/student';
import { Classs } from '../../../../classes/classs';
import { Section } from '../../../../classes/section';

import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import {BusStopService} from '../../../../services/modules/school/bus-stop.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
    providers: [ StudentOldService, BusStopService ],
})

export class UpdateProfileComponent implements OnInit {

   user;

    selectedClass: Classs;
    selectedSection: Section;
    selectedStudent: Student;

    classSectionStudentList: Classs[] = [];

    currentStudent: Student = new Student();

    busStopList = [];

    isLoading = false;

    constructor (private studentService: StudentOldService,
                 private busStopService: BusStopService) { }

    changeSelectedSectionToFirst(): void {
        this.selectedSection = this.selectedClass.sectionList[0];
        this.changeSelectedStudentToFirst();
    }

    changeSelectedStudentToFirst(): void {
        this.selectedStudent = this.selectedSection.studentList[0];
        this.currentStudent.copy(this.selectedStudent);
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        console.log(this.user);
        const data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(
            classSectionStudentList => {
                classSectionStudentList.forEach( classs => {
                    const tempClass = new Classs();
                    tempClass.name = classs.name;
                    tempClass.dbId = classs.dbId;
                    classs.sectionList.forEach( section => {
                        const tempSection = new Section();
                        tempSection.name = section.name;
                        tempSection.dbId = section.dbId;
                        section.studentList.forEach( student => {
                            const tempStudent = new Student();
                            tempStudent.name = student.name;
                            tempStudent.dbId = student.dbId;
                            tempSection.studentList.push(tempStudent);
                        });
                        tempClass.sectionList.push(tempSection);
                    });
                    this.classSectionStudentList.push(tempClass);
                });
                if (this.classSectionStudentList.length > 0) {
                    this.selectedClass = this.classSectionStudentList[0];
                    this.changeSelectedSectionToFirst();
                } else {
                    alert('Student needs to be added first, before profile updation');
                }

            }
        );

        const dataForBusStop = {
            schoolDbId: this.user.activeSchool.dbId,
        };

        this.busStopService.getBusStopList(dataForBusStop, this.user.jwt).then( busStopList => {
            this.busStopList = busStopList;
        });
    }

    getStudentProfile(): void {
        this.isLoading = true;
        const data = {
            studentDbId: this.selectedStudent.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId
        };
        this.studentService.getStudentProfile(data, this.user.jwt).then(
            student => {
                this.isLoading = false;
                const breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    this.currentStudent.copy(student);
                    console.log(this.selectedStudent);
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

    updateProfile(): void {
        if (this.currentStudent.busStopDbId == 0) {
            this.currentStudent.busStopDbId = null;
        }
        if (this.currentStudent.admissionSessionDbId == 0) {
            this.currentStudent.admissionSessionDbId = null;
        }
        if (this.currentStudent.familySSMID
            && this.currentStudent.familySSMID.toString().length !== 0
            && this.currentStudent.familySSMID.toString().length !== 8) {
            alert('Number of digits in Family SSMID should be 8');
            return;
        }

        if (this.currentStudent.mobileNumber
            && this.currentStudent.mobileNumber.toString().length !== 0
            && this.currentStudent.mobileNumber.toString().length !== 10) {
            alert("mobile number should be of l0 digits!");
            return;
        }
        if (this.currentStudent.secondMobileNumber
            && this.currentStudent.secondMobileNumber.toString().length !== 0
            && this.currentStudent.secondMobileNumber.toString().length !== 10) {
            alert("alternate mobile number should be of l0 digits!");
            return;
        }

        if (this.currentStudent.childSSMID
            && this.currentStudent.childSSMID.toString().length !== 0
            && this.currentStudent.childSSMID.toString().length !== 9) {
            alert('Number of digits in Child SSMID should be 9');
            return;
        }
        if (this.currentStudent.aadharNum
            && this.currentStudent.aadharNum.toString().length !== 0
            && this.currentStudent.aadharNum.toString().length !== 12) {
            alert('Number of digits in Aadhar No. should be 12');
            return;
        }
        // this.currentStudent.classDbId = this.selectedClass.dbId;
        this.currentStudent.sessionDbId = this.user.activeSchool.currentSessionDbId;
        this.isLoading = true;
        this.studentService.updateStudentProfileOld(this.currentStudent, this.user.jwt).then(
            student => {
                this.isLoading = false;
                let breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    alert('Student updated successfully');
                } else {
                    this.classSectionStudentList.forEach( classs => {
                        classs.studentList.forEach( tempStudent => {
                            if (tempStudent.dbId === student.dbId) {
                                tempStudent.copy(student);
                                breakLoop = true;
                                return;
                            }
                        });
                        if (breakLoop) { return; }
                    });
                    alert('Student: ' + student.name + ' updated successfully');
                }
            }
        );
    }

    getBusStopName(busStopDbId: any) {
        let stopName = 'None';
        if (busStopDbId !== null) {
            this.busStopList.forEach(busStop => {
                if (busStop.dbId == busStopDbId) {
                    stopName = busStop.stopName;
                    console.log(stopName);
                    return;
                }
            });
        }
        return stopName;
    }

    checkFieldChanged(selectedValue, currentValue): boolean {
        if (selectedValue !== currentValue && !(selectedValue == null && currentValue === '')) {
            return true;
        }
        return false;
    }

    checkLength(value: any) {
        if (value && value.toString().length > 0) {
            return true;
        }
        return false;
    }

    checkRight(value: any, rightValue: number) {
        if (value && value.toString().length === rightValue) {
            return true;
        }
        return false;
    }

    getSessionName(dbId: number): string {
        if (dbId=1) {
            return 'Session 2017-18';
        } else if (dbId=2) {
            return 'Session 2018-19';
        } else if (dbId=3) {}
        return '';
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

    async onImageSelect(evt: any) {
        let image = evt.target.files[0];

        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert("Image type should be either jpg, jpeg, or png");
            return;
        }

        image = await this.cropImage(image, [1,1]);

        while (image.size > 512000) {
            image = await this.resizeImage(image);
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
    }

    resizeImage(file:File):Promise<Blob> {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                let maxWidth = image.width/2;
                let maxHeight = image.height/2;

                // if (width <= maxWidth && height <= maxHeight) {
                //     resolve(file);
                // }

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

}
