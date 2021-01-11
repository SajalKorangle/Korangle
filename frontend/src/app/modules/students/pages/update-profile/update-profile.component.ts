import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../../../classes/student';
import { Classs } from '../../../../classes/classs';
import { Section } from '../../../../classes/section';
import {UpdateProfileServiceAdapter} from './update-profile.service.adapter'

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

    NULL_CONSTANT = null;

    selectedStudent: any;

    currentStudent: any;

    busStopList = [];

    isStudentListLoading = false;
    isLoading = false;

    selectedStudentSection:any;
    currentStudentSection:any;

    classList: any;
    sectionList: any;

    studentList: any;
    studentSectionList: any;
    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];
    currentStudentParameterValueList: any[] = [];

    serviceAdapter: UpdateProfileServiceAdapter

    commonFunctions: CommonFunctions;

    constructor (public studentService: StudentService,
        public schoolService: SchoolService) { }


    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.commonFunctions = CommonFunctions.getInstance();
        this.serviceAdapter = new UpdateProfileServiceAdapter()
        this.serviceAdapter.initializeAdapter(this)
        this.serviceAdapter.initializeData()
    }


    handleDetailsFromParentStudentFilter(value): void {
        this.classList = value['classList'];
        this.sectionList = value['sectionList'];
    }

    handleStudentListSelection(value): void{
        this.selectedStudent = value[0][0];
        this.selectedStudentSection = value[1][0];
        this.serviceAdapter.getStudentProfile(this.selectedStudent.id);
    }

    getParameterValue = (parameter) => {
        try {
            return this.currentStudentParameterValueList.find(x => x.parentStudentParameter === parameter.id).value
        } catch {
            return this.NULL_CONSTANT;
        }
    }

    updateParameterValue = (parameter, value) => {
        let item = this.currentStudentParameterValueList.find(x => x.parentStudentParameter === parameter.id);
        if (!item) {
            item = {parentStudent: this.currentStudent.id, parentStudentParameter: parameter.id, value: value};
            this.currentStudentParameterValueList.push(item);
        } else {
            item.value = value;
        }
    }

    checkCustomFieldChanged = (parameter) => {
        const item = this.currentStudentParameterValueList.find(x => x.parentStudentParameter === parameter.id);
        const old_item = this.studentParameterValueList.find(x => x.parentStudentParameter === parameter.id);
        return item && (!old_item || item.value !== old_item.value);
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
            return this.selectedStudentSection.parentClass == classs.id;
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
