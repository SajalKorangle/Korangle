import {Component, OnInit, Inject} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { StudentService } from '../../../../services/modules/student/student.service';
import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { HomeworkService } from '../../../../services/modules/homework/homework.service';
import {NotificationService} from '../../../../services/modules/notification/notification.service';
import {SmsService} from '../../../../services/modules/sms/sms.service';
import {SmsOldService} from '../../../../services/modules/sms/sms-old.service';
import { IssueHomeworkServiceAdapter } from './issue-homework.service.adapter';
import {UserService} from '../../../../services/modules/user/user.service';
import { isMobile } from '../../../../classes/common.js';

import { Homework } from '../../../../services/modules/homework/models/homework';
import { ImagePreviewDialogComponent } from '../../../../components/modal/image-preview-dialog.component';



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
    isMobile: any;
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
        this.classSectionSubjectList.sort((a, b) => {
            if(a.classDbId > b.classDbId){
                return 1;
            }
            else if(a.classDbId < b.classDbId){
                return -1;
            }
            else{
                if(a.divisionDbId > b.divisionDbid){
                    return 1;
                }
                else{
                    return -1;
                }
            }
        });
        this.selectedClassSection = this.classSectionSubjectList[0];
        this.selectedSubject = this.selectedClassSection.subjectList[0];
    }

    
    changeClassSection():any{
        this.selectedSubject = this.selectedClassSection.subjectList[0];
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
            let image = event.target.files[0];
            if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
                alert('File type should be either jpg, jpeg, or png');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = e => {
                let tempImageData = {
                    orderNumber: null,
                    parentHomework: null,
                    questionImage: reader.result,
                }
                this.currentHomeworkImages.push(tempImageData);
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
        str = tempStr + str +  ' ; ';
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
            this.studentList.filter(item => item.mobileNumber).forEach((item) => {
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

    openEditHomeworkDialog(): void {
        const dialogRef = this.dialog.open(EditHomeworkDialogComponent, {
            width: '1000px',
            data: this.editableHomework,
            disableClose: true,
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(this.editableHomework.editRequired){
                this.isLoading = true;
                this.serviceAdapter.updateHomework(this.editableHomework);
            }
        });
    }

    openImagePreviewDialog(homeworkImages: any, index: any, editable: any): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {'homeworkImages': homeworkImages, 'index': index, 'editable': editable, 'isMobile': this.isMobile()}
        });
    
        dialogRef.afterClosed();
    }
    
    isMobile(): boolean {
        return isMobile();
    }

    isCreateButtonDisabled(str: string): boolean{
        if(str == null){
            return true;
        }
        for(let i=0;i<str.length ;i++){
            if(str != ' '){
                return false;
            }
        }
        return true;
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
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {'homeworkImages': homeworkImages, 'index': index, 'editable': editable, 'isMobile': this.isMobile()}
        });
    
        dialogRef.afterClosed().subscribe(result => {
            
        });
    }

    isMobile(): boolean {
        return isMobile();
    }

}

