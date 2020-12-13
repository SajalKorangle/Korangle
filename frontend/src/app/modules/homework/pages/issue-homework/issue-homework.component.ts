import {Component, OnInit, Inject} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";

import { SubjectService } from '../../../../services/modules/subject/subject.service';
import { ClassService } from '../../../../services/modules/class/class.service';
import { HomeworkService } from '../../../../services/modules/homework/homework.service';
import { IssueHomeworkServiceAdapter } from './issue-homework.service.adapter';
import { Homework } from '../../../../services/modules/homework/models/homework';
 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



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

@Component({
    selector: 'issue-homework',
    templateUrl: './issue-homework.component.html',
    styleUrls: ['./issue-homework.component.css'],
    providers: [
        SubjectService,
        HomeworkService,
        ClassService
    ],
})




export class IssueHomeworkComponent implements OnInit {


    // @Input() user;
    user: any;
    slideIndex = 0;
 
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
    serviceAdapter: IssueHomeworkServiceAdapter;
    editableHomework: any;

    constructor(
        public subjectService: SubjectService,
        public homeworkService: HomeworkService,
        public classService: ClassService,
        public dialog: MatDialog,
    ){}

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.isSessionLoading = true;
        this.isLoading = true;
        this.currentHomework = new Homework;
        this.currentHomeworkImages = [];
        this.serviceAdapter = new IssueHomeworkServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    initialiseClassSubjectData(classSectionSubjectList: any, subjectList: any, classList: any, divisionList: any){
        this.classSectionSubjectList = [];
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
        return promises;
        // return promises;
        // Promise.all(promises).then( value =>{
        //     alert('images uploaded');
        // })
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
        console.log(this.currentHomework);
        Promise.all([
            this.homeworkService.createObject(this.homeworkService.homeworks , this.currentHomework),
        ]).then(value =>{
            this.currentHomework.id = value[0].id;
            Promise.all(this.populateHomeworkImages()).then(value =>{
                alert('Homework has been successfully created');
                this.serviceAdapter.getHomeworks();
                this.currentHomework = new Homework;
                this.currentHomeworkImages = [];
                this.isLoading = false;
            },error =>{
                this.isLoading = false;
            })
            
        },error =>{
            this.isLoading = false;
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
        let hours = d.getHours();
        let minutes = d.getMinutes();
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
            str = 'No deadline is given';
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
        for(let i =0;i<5;i++)
            str+= time[i];
        
        return str;
    }

    removeImage(url: any):any{
        this.currentHomeworkImages.forEach( (image,index) =>{
            if(image.questionImage === url){
                this.currentHomeworkImages.splice(index, 1);
            }
        });
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


    openDialog(): void {
        const dialogRef = this.dialog.open(EditHomeworkDialogComponent, {
            width: '1000px',
            data: this.editableHomework,
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

}

//EDIT HOMEWORK DIALOG COMPONENT

@Component({
    selector: 'edit-homework-dialog',
    templateUrl: 'edit-homework-dialog.html',
    styleUrls: ['./issue-homework.component.css'],
  })
  export class EditHomeworkDialogComponent {
    
    serviceAdapter: any;
    constructor(
        public dialogRef: MatDialogRef<EditHomeworkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: EditHomeworkDialogData,) {
        this.serviceAdapter = new IssueHomeworkServiceAdapter;
    }
  
    onNoClick(): void {
        if(!confirm("Any changes made will be lost, are you sure you want to continue?")) {
            return;
        }
        this.data.editRequired = false;
        this.dialogRef.close();
    }
    
    removeImage(url: any):any{
        this.data.homeworkImages.forEach( (image,index) =>{
            if(image.questionImage == url){
                this.data.homeworkImages.splice(index, 1);
            }
        });
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

  }