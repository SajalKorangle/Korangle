import {Component, OnInit, Inject} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { StudentService } from '../../../../services/modules/student/student.service';
import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { HomeworkService } from '../../../../services/modules/homework/homework.service';
import { IssueHomeworkServiceAdapter } from './issue-homework.service.adapter';
import {NotificationService} from '../../../../services/modules/notification/notification.service';
import {SmsService} from '../../../../services/modules/sms/sms.service';
import {SmsOldService} from '../../../../services/modules/sms/sms-old.service';

import {UserService} from '../../../../services/modules/user/user.service';


import { Homework } from '../../../../services/modules/homework/models/homework';



export interface EditHomeworkDialogData {
    id: any;
    homeworkName: any ;
    parentClassSubject: any;
    startDate: any;
    startTime: any;
    endDate: any;
    endTime: any;
    homeworkText: any ;
    homeworkImages: any;
    editRequired: any;
}


export interface ImagePreviewDialogData {
    
    homeworkImages: any;
    index: any;
    editable: any;
}

@Component({
    selector: 'issue-homework',
    templateUrl: './issue-homework.component.html',
    styleUrls: ['./issue-homework.component.css'],
    providers: [
        SubjectService,
        HomeworkService,
        ClassService,
        StudentService,
        NotificationService,
        UserService,
        SmsService,
        SmsOldService,
    ],
})




export class IssueHomeworkComponent implements OnInit {


    // @Input() user;
    user: any;

    
    STUDENT_LIMITER = 200;
    notif_usernames = [];
 
    classSectionSubjectList: any;
    selectedClassSection: any;
    selectedSubject: any;

    homeworkList: any;
    homeworkImagesList: any;
    currentHomework: Homework;
    homeworkDisplayList: any;

    currentHomeworkImages: any;
    isSessionLoading: any;
    isLoading: any;
    showContent: any;
    editableHomework: any;

    noPermission: any;
    settings : any;
    smsBalance: any;

    homeworkCreatedMessage = "New Homework is added in <subject>,\n Title - '<homeworkName>' \n Last date to submit - <deadLine> ";
    homeworkUpdateMessage = "Please note, there are changes in the Homework '<homeworkName>' of <subject>";
    homeworkDeleteMessage = "Please note, the homework '<homeworkName>' of subject <subject> has been removed";
    
    studentList: any;
    serviceAdapter: IssueHomeworkServiceAdapter;

    constructor(
        public subjectService: SubjectService,
        public homeworkService: HomeworkService,
        public classService: ClassService,
        public studentService: StudentService,
        public notificationService: NotificationService,
        public userService: UserService,
        public smsService: SmsService,
        public smsOldService: SmsOldService,
        public dialog: MatDialog,
    ){}

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.isSessionLoading = true;
        this.isLoading = false;
        this.showContent = false;
        this.noPermission = false;
        this.currentHomework = new Homework;
        this.currentHomeworkImages = [];
        this.serviceAdapter = new IssueHomeworkServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    initialiseClassSubjectData(classSectionSubjectList: any, subjectList: any, classList: any, divisionList: any){
        this.classSectionSubjectList = [];
        if(classSectionSubjectList.length === 0){
            this.noPermission = true;
            this.isLoading = false;
            this.isSessionLoading = false;
            return ;
        }
        classSectionSubjectList.forEach(element =>{
            let classSection = this.classSectionSubjectList.find(classSection => classSection.classDbId == element.parentClass && classSection.divisionDbId == element.parentDivision);
            if(classSection === undefined)
            {
                let tempClass = classList.find(classs => classs.id == element.parentClass);
                let tempDivision = divisionList.find(division => division.id == element.parentDivision); 
                let tempClassSection ={
                    classDbId: element.parentClass,
                    divisionDbId: element.parentDivision,
                    name: tempClass.name + ' ' + tempDivision.name,
                    subjectList: []
                }
                this.classSectionSubjectList.push(tempClassSection);
                classSection = this.classSectionSubjectList.find(classSection => classSection.classDbId == element.parentClass && classSection.divisionDbId == element.parentDivision);
            }
            let subject = classSection.subjectList.find(subject => subject.subjectDbId == element.parentSubject);
            if(subject === undefined){
                let tempSubject = subjectList.find(subject => subject.id == element.parentSubject);
                let tempSubjectData = {
                    classSubjectDbId: element.id,
                    subjectDbId: tempSubject.id,
                    name: tempSubject.name,
                }
                classSection.subjectList.push(tempSubjectData);
            }    
        })
        
        this.classSectionSubjectList.forEach(classsSection =>{
            classsSection.subjectList.sort((a, b) => a.subjectDbId < b.subjectDbId ? -1 : a.subjectDbId > b.subjectDbId ? 1 : 0);
        })
        this.classSectionSubjectList.sort((a, b) => a.classDbId < b.classDbId ? -1 : a.classDbId > b.classDbId ? 1 : 0);
        this.classSectionSubjectList.sort((a, b) => a.divisionDbId < b.divisionDbId ? -1 : a.divisionDbId > b.divisionDbId ? 1 : 0);
        this.selectedClassSection = this.classSectionSubjectList[0];
        this.selectedSubject = this.selectedClassSection.subjectList[0];
    }

    
    changeClassSection():any{
        this.selectedSubject = this.selectedClassSection.subjectList[0];
    }
    

    createHomework():any{
        this.isLoading = true;
        this.currentHomework.parentClassSubject = this.selectedSubject.classSubjectDbId;
        let currentDate = new Date();
        this.currentHomework.startDate = this.formatDate(currentDate, '');
        this.currentHomework.startTime = this.formatTime(currentDate);
        if(this.currentHomework.endDate != null && this.currentHomework.endTime == null){
            this.currentHomework.endTime =  '23:59';
        }
        
        
        Promise.all([
            this.homeworkService.createObject(this.homeworkService.homeworks , this.currentHomework),
        ]).then(value =>{
            this.currentHomework.id = value[0].id;
            this.populateCurrentHomework();
            
            Promise.all(this.populateHomeworkImages()).then(sValue =>{
                console.log(sValue);
                alert('Homework has been successfully created');
                this.populateStudentList(this.studentList, this.currentHomework);
                this.populateCurrentHomeworkImages(value[0].id, sValue);
                this.currentHomework = new Homework;
                this.currentHomeworkImages = [];
                this.isLoading = false;
                if(this.settings.sendCreateUpdate == true && this.settings.sentUpdateType !='NULL'){
                    this.serviceAdapter.sendSMSNotification(this.studentList, this.homeworkCreatedMessage);
                }
            },error =>{
                this.isLoading = false;
            })
        },error =>{
            this.isLoading = false;
        });
        
    }

    sortHomeworks(): any{
        this.homeworkList.sort((a, b) => {
            if(a.startDate > b.startDate){
                return -1;
            }
            else if(a.startDate < b.startDate){
                return 1;
            }
            else{
                if(a.startTime > b.startTime){
                    return -1;
                }
                else if(a.startTime < b.startTime){
                    return 1;
                }
            }
        });
    }

    populateCurrentHomework(): any{
        let tempHomework = {
            id: this.currentHomework.id,
            homeworkName: this.currentHomework.homeworkName ,
            parentClassSubject: this.currentHomework.parentClassSubject,
            startDate: this.currentHomework.startDate,
            startTime: this.currentHomework.startTime,
            endDate: this.currentHomework.endDate,
            endTime: this.currentHomework.endTime,
            homeworkText: this.currentHomework.homeworkText,
            homeworkImages: [],
        }
        this.homeworkList.push(tempHomework);
        this.sortHomeworks();
    }

    populateCurrentHomeworkImages(homeworkId: any,imagesList: any): any{
        let tempHomework = this.homeworkList.find(homework => homework.id == homeworkId);
        imagesList.forEach(image =>{
            if(image.questionImage != undefined)
                tempHomework.homeworkImages.push(image);
        });
        this.sortHomeworks();
    }

    populateHomeworkImages(): any{
        let index = 0;
        let promises = [];
        this.currentHomeworkImages.forEach(image =>{
            image.parentHomework = this.currentHomework.id;
            image.orderNumber = index;
            let temp_form_data = new FormData();
            const layout_data = { ...image,};
            Object.keys(layout_data).forEach(key => {
                if (key === 'questionImage' ) {
                    const file = this.dataURLtoFile(layout_data[key], 'questionImage' + index +'.jpeg');
                    temp_form_data.append(key, this.dataURLtoFile(layout_data[key], 'questionImage' + index +'.jpeg'));
                } else {
                    temp_form_data.append(key, layout_data[key]);
                }
            });
            index = index + 1;
            promises.push(this.homeworkService.createObject(this.homeworkService.homework_question, temp_form_data));
        })

        let studentIdList = [];
        this.studentList.forEach(student =>{
            studentIdList.push(student.dbId);
        });

        studentIdList.forEach(student =>{
            let tempData = {
                'parentStudent': student,
                'parentHomework': this.currentHomework.id,
                'homeworkStatus': 'GIVEN',
            }
            promises.push(this.homeworkService.createObject(this.homeworkService.homework_status, tempData));
        })

        return promises;
    }


    populateStudentList(studentList: any, homeworkData: any): any{
        studentList.forEach(student =>{
            if(homeworkData.homeworkName!= undefined){
                student.homeworkName = homeworkData.homeworkName;
            }
            if(homeworkData.endDate != undefined){
                student.deadLine = this.displayDateTime(homeworkData.endDate, homeworkData.endTime);
            }
        });
    }

    populateEditedHomework(data: any): any{
        let tempHomeworkData = data[0];
        let previousHomework = this.homeworkList.find(homework => homework.id === tempHomeworkData.id);
        previousHomework.homeworkName = tempHomeworkData.homeworkName;
        previousHomework.endDate = tempHomeworkData.endDate;
        previousHomework.endTime = tempHomeworkData.endTime;
        previousHomework.homeworkText = tempHomeworkData.homeworkText;
        previousHomework.homeworkImages = [];
        data.forEach(image => {
            if(image.questionImage != undefined)
                previousHomework.homeworkImages.push(image);
        });
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
                    parentHomework: null,
                    questionImage: reader.result,
                }
                this.currentHomeworkImages.push(tempImageData);
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

    removeImage(index: any):any{
        this.currentHomeworkImages.splice(index, 1);
    }
    

    editHomework(homeworkId:any):any{
        let tempHomework = this.homeworkList.find( homework => homework.id == homeworkId);

        this.editableHomework = {
            id: tempHomework.id,
            homeworkName: tempHomework.homeworkName,
            parentClassSubject: tempHomework.parentClassSubject,
            startDate: tempHomework.startDate,
            startTime: tempHomework.startTime,
            endDate: tempHomework.endDate,
            endTime: tempHomework.endTime,
            homeworkText: tempHomework.homeworkText,
            homeworkImages: [],
            editRequired: true,
        }
        tempHomework.homeworkImages.forEach(image =>{
            this.editableHomework.homeworkImages.push(image);
        });
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for(let key in obj){
            ret = ret.replace('<'+key+'>', obj[key]);
        }
        return ret;
    }

    hasUnicode(message): boolean {
        for (let i=0; i<message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getEstimatedSMSCount = (message: any) => {
        let count = 0;
        if(this.settings.sentUpdateType=='NOTIFICATION')return 0;
            this.studentList.filter(item => item.mobileNumber).forEach((item, i) => {
                if(this.settings.sentUpdateType=='SMS' || item.notification==false){
                    count += this.getMessageCount(this.getMessageFromTemplate(message, item));
                }
            })

        return count;
    }

    getMessageCount = (message) => {
        if (this.hasUnicode(message)){
            return Math.ceil(message.length/70);
        }else{
            return Math.ceil( message.length/160);
        }
    }

    getEstimatedNotificationCount = () => {
        let count = 0;
        if(this.settings.sentUpdateType=='SMS')return 0;

        count = this.studentList.filter((item) => {
            return item.mobileNumber && item.notification;
        }).length;

        return count;
    }   

    openEditHomeworkDialog(): void {
        const dialogRef = this.dialog.open(EditHomeworkDialogComponent, {
            width: '1000px',
            data: this.editableHomework,
            disableClose: true,
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if(this.editableHomework.editRequired){
                this.isLoading = true;
                this.serviceAdapter.updateHomework(this.editableHomework);
                // console.log(this.editableHomework);
            }
        });
    }

    openImagePreviewDialog(homeworkImages: any, index: any, editable: any): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            width: '1000px',
            data: {'homeworkImages': homeworkImages, 'index': index, 'editable': editable}
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            
        });
    }

}

//EDIT HOMEWORK DIALOG COMPONENT

@Component({
    selector: 'edit-homework-dialog',
    templateUrl: 'edit-homework-dialog.html',
    styleUrls: ['./issue-homework.component.css'],
  })
  export class EditHomeworkDialogComponent {
    
    constructor(
        public dialogRef: MatDialogRef<EditHomeworkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: EditHomeworkDialogData,
        public dialog: MatDialog,) {
    }
  
    onNoClick(): void {
        if(!confirm("Any changes made will be lost, are you sure you want to continue?")) {
            return;
        }
        this.data.editRequired = false;
        this.dialogRef.close();
    }
    
    removeImage(index: any):any{
        this.data.homeworkImages.splice(index, 1);
    }

    readURL(event): void {
        
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
                alert('File type should be either jpg, jpeg, or png');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = e => {

                let tempData = {
                    orderNumber: null,
                    parentHomework: this.data.id,
                    questionImage: reader.result,
                }
                this.data.homeworkImages.push(tempData);
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

    openImagePreviewDialog(homeworkImages: any, index: any, editable): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            width: '1000px',
            data: {'homeworkImages': homeworkImages, 'index': index, 'editable': editable}
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            
        });
    }

}

  
@Component({
    selector: 'image-preview-dialog',
    templateUrl: 'image-preview-dialog.html',
    styleUrls: ['./issue-homework.component.css'],
  })
  export class ImagePreviewDialogComponent {
    
    constructor(
        public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: ImagePreviewDialogData,) {
    }
  
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    decreaseIndex(): void{
        this.data.index = this.data.index - 1;
        if(this.data.index < 0)
            this.data.index = this.data.homeworkImages.length - 1;
    }

    
    increaseIndex(): void{
        this.data.index = this.data.index + 1;
        if(this.data.index == this.data.homeworkImages.length)
            this.data.index = 0;
    }

    setIndex(i: any): void{
        this.data.index  = i;
    }

    removeImage(index: any):any{
        this.data.homeworkImages.splice(index, 1);
        if(this.data.homeworkImages.length == 0){
            this.dialogRef.close();
        }
        if(index == this.data.index){
            this.decreaseIndex();
        }
    }
}