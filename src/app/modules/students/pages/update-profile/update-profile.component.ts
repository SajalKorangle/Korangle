import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../../../classes/student';
import { Classs } from '../../../../classes/classs';
import { Section } from '../../../../classes/section';

import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import {BusStopService} from '../../../../services/modules/school/bus-stop.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
    providers: [ StudentOldService, BusStopService, StudentService ],
})

export class UpdateProfileComponent implements OnInit {

   user;

    selectedClass: Classs;
    selectedSection: Section;
    selectedStudent: Student;

    classSectionStudentList: Classs[] = [];

    // currentStudent: Student = new Student();
    currentStudent: any;

    busStopList = [];

    isLoading = false;
    // classList: any;
    // sectionList: any;
    selectedStudentSection:any;
    currentStudentSection:any;
    constructor (private studentService: StudentOldService,
                 private busStopService: BusStopService,
                 private studentServiceN: StudentService,
                 ) { }

    // changeSelectedSectionToFirst(): void {
    //     this.selectedSection = this.selectedClass.sectionList[0];
    //     this.changeSelectedStudentToFirst();
    // }

    // changeSelectedStudentToFirst(): void {
    //     this.selectedStudent = this.selectedSection.studentList[0];
    //     this.currentStudent.copy(this.selectedStudent);
    // }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        const dataForBusStop = {
            schoolDbId: this.user.activeSchool.dbId,
        };

        this.busStopService.getBusStopList(dataForBusStop, this.user.jwt).then( busStopList => {
            this.busStopList = busStopList;
        });
    }
// classes/common function
    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    handleDetailsFromParentStudentFilter(value): void{
        console.log(value);
        return;
    }


    handleStudentSectionListSelection(value): void{
        console.log('Value of student section');
        console.log(value);
        this.selectedStudentSection = value[0];
    }

    handleStudentListSelection(value): void{
        if(value == undefined || value.length == 0) return;
        console.log('Value from handle studentSelection');
        console.log(value);
        if(this.selectedStudentSection == undefined || this.selectedStudentSection == '') return;
        this.getStudentProfile(value[0].id);
    }

    getStudentProfile(studentId ?: any): void {
        this.isLoading = true;
        // const data = {
        //     studentDbId: studentId?studentId:this.selectedStudent.dbId,
        //     sessionDbId: this.user.activeSchool.currentSessionDbId
        // };
        let dataN = {
            'id': studentId?studentId:this.selectedStudent.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId
        }
        this.studentServiceN.getObject(this.studentServiceN.student, dataN).then(value=>{
            console.log('Value from new service');
            console.table(value);
            this.currentStudent = this.copyObject(value);
            this.selectedStudent = this.copyObject(value);
            this.currentStudentSection = this.copyObject(this.selectedStudentSection);
            this.isLoading = false;
            // roll number, id->dbId, newcategory->category(similar for religin), busStopId->busstopdbId(similar admissionSession, sectionDbID ?,sectionName?,classname,classDbId?)
        });
    }

    updateProfile(): void {
        if (this.currentStudent.currentBusStop == 0) {
            this.currentStudent.currentBusStop = null;
        }
        if (this.currentStudent.admissionSession == 0) {
            this.currentStudent.admissionSession = null;
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
        // this.currentStudent.studentSection.parentClass = this.selectedClass.dbId;
        // this.currentStudent.sessionDbId = this.user.activeSchool.currentSessionDbId;
        this.isLoading = true;
        console.log(this.currentStudent);
        console.log(this.currentStudentSection);
        this.studentServiceN.updateObject(this.studentServiceN.student,this.currentStudent).then(student=>{
            console.table(student);
            this.selectedStudent = this.copyObject(student);
            if(this.selectedStudentSection.rollNumber != this.currentStudentSection.rollNumber
                && this.currentStudent.id == this.currentStudentSection.parentStudent){
                this.studentServiceN.updateObject(this.studentServiceN.student_section,this.currentStudentSection).then(
                    studentSection=>{
                        this.selectedStudentSection = this.copyObject(studentSection);
                        alert('Student: ' + student.name + 'updated successfully');
                        this.isLoading = false;
                });
            }else{
                alert('Student: ' + student.name + 'updated successfully without');
                this.isLoading = false;
            }
            
        });
        return;
        // this.studentService.updateStudentProfileOld(this.currentStudent, this.user.jwt).then(
        //     student => {
        //         this.isLoading = false;
        //         let breakLoop = false;
        //         if (this.selectedStudent.dbId === student.dbId) {
        //             this.selectedStudent.copy(student);
        //             alert('Student updated successfully');
        //         } else {
        //             this.classSectionStudentList.forEach( classs => {
        //                 classs.studentList.forEach( tempStudent => {
        //                     if (tempStudent.dbId === student.dbId) {
        //                         tempStudent.copy(student);
        //                         breakLoop = true;
        //                         return;
        //                     }
        //                 });
        //                 if (breakLoop) { return; }
        //             });
        //             alert('Student: ' + student.name + ' updated successfully');
        //         }
        //     }
        // );
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
