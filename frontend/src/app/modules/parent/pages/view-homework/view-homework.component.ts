import { Component, OnInit, OnChanges, HostListener } from '@angular/core';

import {DataStorage} from "../../../../classes/data-storage";
import { ViewHomeworkServiceAdapter } from "./view-homework.service.adapter"
import { HomeworkService } from '../../../../services/modules/homework/homework.service'

import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import { isMobile } from '../../../../classes/common.js';

import {MatDialog} from '@angular/material';
import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';

import {CdkDragDrop, moveItemInArray, CdkDragEnter} from '@angular/cdk/drag-drop';

@Component({
  selector: 'view-homework',
  templateUrl: './view-homework.component.html',
  styleUrls: ['./view-homework.component.css'],
    providers: [ HomeworkService, SubjectService, StudentService ],
})

export class ViewHomeworkComponent implements OnInit, OnChanges {

    user;

    
    loadingCount = 4;
    checkedHomeworkCount =  0;
    submittedHomeworkCount= 0;

    isLoadingCheckedHomeworks = true;
    isLoadingSubmittedHomeworks = true;
    loadMoreHomework = true;

    selectedStudent: any;

    isLoading = false;
    isSessionLoading = false;
    showContent = false;

    serviceAdapter: any;

    subjectList: any;

    isSubmitting: any;

    selectedSubject: any;
    studentClassData: any;
    currentHomework: any;

    pendingHomeworkList: any;
    completedHomeworkList: any;
    homeworkOpen: any;

    isHomeworkLoading: any;
    currentHomeworkImages: any;
    currentHomeworkAnswerImages: any;
    toSubmitHomework: any;


    constructor (
        public homeworkService: HomeworkService,
        public subjectService: SubjectService,
        public studentService: StudentService,
        public dialog: MatDialog,
        ) { }

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.isSubmitting = false;
        this.showContent = false;
        this.loadMoreHomework = true;
        this.serviceAdapter = new ViewHomeworkServiceAdapter;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        console.log(this.isMobile());

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

    onNoClick():any{
        this.isSubmitting = false;
        this.toSubmitHomework = {};
    }

    readURL(event): void {
        console.log(event);
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
                    parentHomework: this.toSubmitHomework.dbId,
                    parentStudent: this.selectedStudent,
                    answerImage: reader.result,
                }
                this.toSubmitHomework.answerImages.push(tempImageData);
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
        this.toSubmitHomework.answerImages.splice(index,1);
    }


    submitHomework(homework: any){
        
        this.toSubmitHomework = {
            dbId: homework.dbId,
            homeworkName: homework.homeworkName,
            startDate: homework.startDate,
            endDate: homework.endDate,
            startTime: homework.startTime,
            endTime: homework.endTime,
            homeworkText: homework.homeworkText,
            subjectDbId: homework.subjectDbId,
            subjectName: homework.subjectName,
            statusDbId: homework.statusDbId,
            homeworkStatus: homework.homeworkStatus,
            submissionDate: homework.submissionDate,
            submissionTime: homework.submissionTime,
            answerText: homework.answerText,
            homeworkRemark: homework.remark,
            questionImages: [],
            answerImages: [],
            previousAnswerImages: [],
        }
        this.currentHomeworkImages.forEach(element =>{
            this.toSubmitHomework.questionImages.push(element);
        })
        this.currentHomeworkAnswerImages.forEach(element =>{
            this.toSubmitHomework.answerImages.push(element);
            this.toSubmitHomework.previousAnswerImages.push(element);
        });
        this.isSubmitting = true;
        
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

  

    getFilteredHomeworkList(): any{
        // console.log(this.pendingHomeworkList);
        return this.pendingHomeworkList.filter(homeworks =>{
            if(this.selectedSubject.id == -1)return true;
            if(homeworks.subjectDbId == this.selectedSubject.id)return true;
            return false;
        });
    }

    getFilteredCompletedHomeworkList(): any{
        return this.completedHomeworkList.filter(homeworks =>{
            if(this.selectedSubject.id == -1)return true;
            if(homeworks.subjectDbId == this.selectedSubject.id)return true;
            return false;
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        console.log(event.previousIndex ,event.currentIndex);
        // moveItemInArray(this.toSubmitHomework.answerImages, event.previousIndex, event.currentIndex);
        let temp = this.toSubmitHomework.answerImages[event.previousIndex];
        this.toSubmitHomework.answerImages[event.previousIndex] = this.toSubmitHomework.answerImages[event.currentIndex];
        this.toSubmitHomework.answerImages[event.currentIndex] = temp;
        
        
    }

    entered(event: CdkDragEnter) {
        moveItemInArray(this.toSubmitHomework.answerImages, event.item.data, event.container.data);
    }

    @HostListener('window:scroll', ['$event']) onScrollEvent(event){
        if((document.documentElement.clientHeight + document.documentElement.scrollTop + 1) > document.documentElement.scrollHeight && this.loadMoreHomework == true){
            this.serviceAdapter.loadMoreHomeworks();
        }
    } 

    isMobile(): boolean {
        return isMobile();
    }

    openImagePreviewDialog(homeworkImages: any, index: any, editable): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            width: '1000px',
            data: {'homeworkImages': homeworkImages, 'index': index, 'editable': editable, 'isMobile': this.isMobile()}
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            
        });
    }

}
