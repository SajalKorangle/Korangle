import { Component, OnInit, OnChanges } from '@angular/core';

import {DataStorage} from "../../../../classes/data-storage";
import { ViewHomeworkServiceAdapter } from "./view-homework.service.adapter"
import { HomeworkService } from '../../../../services/modules/homework/homework.service'

import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { StudentService } from '../../../../services/modules/student/student.service';

@Component({
  selector: 'view-homework',
  templateUrl: './view-homework.component.html',
  styleUrls: ['./view-homework.component.css'],
    providers: [ HomeworkService, SubjectService, StudentService ],
})

export class ViewHomeworkComponent implements OnInit, OnChanges {

    user;

    selectedStudent: any;

    isLoading = false;
    isSessionLoading = false;
    showContent = false;

    serviceAdapter: any;

    subjectList: any;

    homeworkList: any;
    isSubmitting: any;

    selectedSubject: any;
    studentClassData: any;
    currentHomework: any;


    constructor (
        public homeworkService: HomeworkService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        ) { }

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.isSubmitting = false;
        this.showContent = false;
        this.homeworkList = [];
        this.serviceAdapter = new ViewHomeworkServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    displayDateTime(date: any, time: any): any{
        let str='';
        let tempStr ='';

        if(date == null){
            str = 'No deadline';
            return str;
        }
        for(let i =0; i<date.length; i++){
            if(date[i] == '-'){
                str = '-' + tempStr + str;
                tempStr = '';

            }
            else{
                tempStr+= date[i];
            }
        }
        str = tempStr + str;
        str = str +  ' ; ';
        for(let i =0;i<5;i++){
            str = str + time[i];
        }
        
        return str;
    }

    getClass(){
        let classs = '';
        if(this.isSubmitting == true){
            classs += 'col-md-6';
        }
        else{
            classs+= 'col-md-12';
        }
        return classs;
    }

    closeSubmission():any{
        this.isSubmitting = false;
        this.currentHomework = {};
    }

    readURL(event): void {
        
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            if (image.type !== 'image/jpeg' && image.type !== 'image/png' && image.type !== 'application/pdf') {
                alert('File type should be either pdf, jpg, jpeg, or png');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = e => {
                // console.log(reader.result);
                let tempImageData = {
                    orderNumber: null,
                    parentHomework: this.currentHomework.homeworkId,
                    parentStudent: this.selectedStudent,
                    answerImage: reader.result,
                }
                this.currentHomework.answerImages.push(tempImageData);
                // this.updatePDF();
            };
            reader.readAsDataURL(image);
            
        }
    }

    
    dataURLtoFile(dataurl, filename) {

        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, {type: mime});
        } catch (e) {
            return null;
        }
    }

    removeImage(index : any){
        this.currentHomework.answerImages.splice(index,1);
    }


    submitHomework(homework: any){
        this.isSubmitting = true;
        this.currentHomework = {
            homeworkId: homework.homeworkId,
            statusDbId: homework.statusDbId,
            submissionDate: homework.submissionDate,
            submissionTime: homework.submissionTime,
            answerText: homework.answerText,
            answerImages: [],
            previousAnswerImages: [],
        }
        homework.answerImages.forEach(image =>{
            let tempImage = {
                'id': image.id,
                'answerImage': image.answerImage,
                'orderNumber': image.orderNumber,
            }
            this.currentHomework.answerImages.push(tempImage);
            this.currentHomework.previousAnswerImages.push(tempImage);
        })
    }

    
    formatDate(dateStr: any, status: any): any {

        let d = new Date(dateStr);

        if (status === 'firstDate') {
            d = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (status === 'lastDate') {
            d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    formatTime(dateStr: any): any {

        let d = new Date(dateStr);
        let hours = '' + d.getHours();
        let minutes = '' + d.getMinutes();

        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;

        return [hours, minutes].join(':');
    }

    populateSubmittedHomework(homework: any){
        let tempHomework  = this.homeworkList.find(homeworks => homeworks.homeworkId == homework[0].parentHomework);
        tempHomework.homeworkStatus = homework[0].homeworkStatus;
        tempHomework.submissionDate = homework[0].submissionDate;
        tempHomework.submissionTime = homework[0].submissionTime;
        tempHomework.homeworkRemark = homework[0].remark;
        tempHomework.answerText = homework[0].answerText;
        tempHomework.answerImages = [];
        homework.forEach(image =>{
            if(image.answerImage != undefined){
                tempHomework.answerImages.push(image);
            }
        });
        tempHomework.answerImages.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0);
    }

}
