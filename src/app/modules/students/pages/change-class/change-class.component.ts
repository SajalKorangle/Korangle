import { Component, Input, OnInit } from '@angular/core';

import { ClassOldService } from '../../../../services/modules/class/class-old.service';
import { StudentService } from '../../../../services/modules/student/student.service';
import {DataStorage} from "../../../../classes/data-storage";


@Component({
    selector: 'change-class',
    templateUrl: './change-class.component.html',
    styleUrls: ['./change-class.component.css'],
    providers: [ ClassOldService, StudentService ],
})

export class ChangeClassComponent implements OnInit {

    user;

    selectedStudent: any;

    selectedSessionDbId: any;

    selectedClass: any;
    classSectionList = [];
    selectedStudentList = [];
    studentClassSection : any;

    classList = [];
    sectionList = [];
    studentSectionList = [];

    isLoading = false;
    isStudentListLoading = false;
    showDetails = false;

    constructor (private classService: ClassOldService,                 
                 private studentService: StudentService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        const data = {
            sessionDbId : this.user.activeSchool.currentSessionDbId,
        };
        this.selectedSessionDbId = this.user.activeSchool.currentSessionDbId;
        this.downloadClassSectionList(data);
    }

    handleDetailsFromParentStudentFilter(details: any): void {        
        this.classList = details.classList;
        this.sectionList = details.sectionList;
        this.studentSectionList = details.studentSectionList;        
     }

    handleStudentListSelection(studentList: any): void {               
        this.selectedStudent = studentList[0];
        this.studentClassSection = this.getStudentClassSectionList(this.selectedStudent,this.selectedSessionDbId);
        this.selectedStudent.studentSectionDbId = this.studentClassSection.id;
        this.selectedStudent.className = this.getClassName(this.studentClassSection);        
        this.selectedStudent.sectionName = this.getSectionName(this.studentClassSection);
    }

    getStudentClassSectionList(student: any,sessionId: any){
        return this.studentSectionList.find(studentSection => {
            return studentSection.parentStudent == student.id && studentSection.parentSession == sessionId;            
        })
    }

    getClassName(studentClassSection: any): any{        
        this.selectedStudent.classDbId = this.studentClassSection.parentClass;
        return this.classList.find(classs => {
            return classs.dbId == studentClassSection.parentClass;
        }).name;        
    }

    getSectionName(studentClassSection: any): any {
        this.selectedStudent.sectionDbId = this.studentClassSection.parentDivision;
        return this.sectionList.find(section => {
            return section.id == studentClassSection.parentDivision;
        }).name;
    }

    onSessionChange(session: any): void {
        const data = {
            sessionDbId : session.id,
        };
        this.selectedSessionDbId = session.id;
        this.downloadClassSectionList(data);
    }

    downloadClassSectionList(data: any): void {
        this.selectedClass = null;
        this.isLoading = true;
        this.classService.getClassSectionList(data, this.user.jwt).then(classSectionList => {            
            this.isLoading = false;
            this.classSectionList = classSectionList;
            this.classSectionList.forEach( classs => {
                classs.selectedSection = classs.sectionList[0];
            });
            this.selectedClass = this.classSectionList[0];
        }, error => {
            this.isLoading = false;
        });
    }

    changeClassSection(): void {
        let data = {
            id: this.selectedStudent.studentSectionDbId,
            parentDivision: this.selectedClass.selectedSection.dbId,
            parentStudent: this.selectedStudent.dbId,
            parentClass: this.selectedClass.dbId,
            parentSession: this.selectedSessionDbId,
        };
        let studentDbId = this.selectedStudent.dbId;
        this.isLoading = true;
        this.studentService.partiallyUpdateObject(this.studentService.student_section,data).then(response => {
            this.isLoading = false;            
            alert('Class Updated Successfully');            
            if (studentDbId === this.selectedStudent.dbId) {
                this.selectedStudent.className = this.selectedClass.name;
                this.selectedStudent.sectionName = this.selectedClass.selectedSection.name;
                this.selectedStudent.sectionDbId = this.selectedClass.selectedSection.dbId;
            }
            
        },error =>{
            this.isLoading = false;
        })        
    }

}
