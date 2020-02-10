import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../../../classes/student';
import { Classs } from '../../../../classes/classs';
import { Section } from '../../../../classes/section';

import { StudentService } from '../../../../services/modules/student/student.service';
import { SchoolService } from '../../../../services/modules/school/school.service';
import {DataStorage} from "../../../../classes/data-storage";
import { CommonFunctions } from "../../../../classes/common-functions";

@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
    providers: [ SchoolService, StudentService ],
})

export class UpdateProfileComponent implements OnInit {

   user;

    selectedStudent: any;

    currentStudent: any;

    busStopList = [];

    isLoading = false;

    selectedStudentSection:any;
    currentStudentSection:any;

    classList: any;
    sectionList: any;

    studentList: any;
    studentSectionList: any;

    commonFunctions: CommonFunctions;

    constructor (private studentService: StudentService,
                 private schoolService: SchoolService) { }


    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.commonFunctions = CommonFunctions.getInstance();

        const dataForBusStop = {
            'parentSchool': this.user.activeSchool.dbId,
        };

        this.schoolService.getObjectList(this.schoolService.bus_stop,dataForBusStop).then( busStopList => {
            this.busStopList = busStopList;
        });
    }


    handleDetailsFromParentStudentFilter(value): void {
        this.classList = value['classList'];
        this.sectionList = value['sectionList'];
    }

    handleStudentListSelection(value): void{
        console.log(value);
        this.selectedStudent = value[0][0];
        this.selectedStudentSection = value[1][0];
        this.getStudentProfile(this.selectedStudent.id);
    }

    getStudentProfile(studentId : any): void {
        this.isLoading = true;
        let data = {
            'id': studentId,
        };
        this.studentService.getObject(this.studentService.student, data).then(value=>{
            this.currentStudent = this.commonFunctions.copyObject(value);
            Object.keys(value).forEach(key => {
                this.selectedStudent[key] = value[key];
            });
            this.currentStudentSection = this.commonFunctions.copyObject(this.selectedStudentSection);
            this.isLoading = false;
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

        this.isLoading = true;
        let service_list = [];
        
        service_list.push(this.studentService.updateObject(this.studentService.student,this.currentStudent));

        if(this.selectedStudentSection.rollNumber != this.currentStudentSection.rollNumber
            && this.currentStudent.id == this.currentStudentSection.parentStudent){
            service_list.push(this.studentService.updateObject(this.studentService.student_section,this.currentStudentSection));
        }

        Promise.all(service_list).then(value =>{
            Object.keys(value[0]).forEach(key =>{
                this.selectedStudent[key] = value[0][key];
            });
            this.currentStudent = this.commonFunctions.copyObject(this.selectedStudent);
            if(value.length == 2){
                Object.keys(value[1]).forEach(key => {
                    this.selectedStudentSection[key] = value[1][key];
                });

                this.currentStudentSection = this.commonFunctions.copyObject(this.selectedStudentSection);
            }
            alert('Student: ' + this.selectedStudent.name + ' updated successfully');
            this.isLoading = false;

        },error => {
            this.isLoading = false;
        });
    }

    getBusStopName(busStopDbId: any) {
        let stopName = 'None';
        if (busStopDbId !== null) {
            this.busStopList.forEach(busStop => {
                if (busStop.id == busStopDbId) {
                    stopName = busStop.stopName;
                    console.log(stopName);
                    return;
                }
            });
        }
        return stopName;
    }

    getClassName(): any {
        return this.classList.find(classs => {
            return this.selectedStudentSection.parentClass == classs.dbId;
        }).name;
    }

    getSectionName(): any {
        return this.sectionList.find(section => {
            return this.selectedStudentSection.parentDivision == section.id;
        }).name;
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

        this.isLoading = true;
        let profile_image_data = new FormData();
        profile_image_data.append('id', new Blob([this.selectedStudent.id], {
            type: 'application/json'
        }));
        profile_image_data.append('profileImage', image);


        this.studentService.partiallyUpdateObject(this.studentService.student, profile_image_data).then(value => {
            Object.keys(value).forEach(key => {
                this.selectedStudent[key] = value[key];
            });
            this.isLoading = false;
        }, error =>{
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
