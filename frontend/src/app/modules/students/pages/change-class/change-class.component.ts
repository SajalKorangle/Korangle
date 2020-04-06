import { Component, Input, OnInit } from '@angular/core';

<<<<<<< HEAD
import { StudentService } from '../../../../services/modules/student/student.service';
=======
import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
>>>>>>> frontend/remove_class_old_service
import {DataStorage} from "../../../../classes/data-storage";


@Component({
    selector: 'change-class',
    templateUrl: './change-class.component.html',
    styleUrls: ['./change-class.component.css'],
<<<<<<< HEAD
    providers: [ StudentService ],
=======
    providers: [ ClassService, StudentOldService ],
>>>>>>> frontend/remove_class_old_service
})

export class ChangeClassComponent implements OnInit {

    user;

    classList = [];
    sectionList = [];

    selectedStudent: any;
    selectedStudentSection: any;

    selectedClass: any;
    classSectionList = [];

    isLoading = false;
    isStudentListLoading = false;

<<<<<<< HEAD
    constructor (private studentService: StudentService) { }
=======
    constructor (private classService : ClassService,
                 private studentService: StudentOldService) { }
>>>>>>> frontend/remove_class_old_service

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        const data = {
            sessionDbId : this.user.activeSchool.currentSessionDbId,
        };
    }

    handleDetailsFromParentStudentFilter(details: any): void {        
        this.classList = details.classList;
        this.sectionList = details.sectionList;
        this.classSectionList = this.classList;
        this.classSectionList.forEach(classs => {
            classs['sectionList'] = this.sectionList;
            classs.selectedSection = this.sectionList[0];
        });
        this.selectedClass = this.classSectionList[0];
     }

    handleStudentListSelection(studentDetailsList: any): void {
        this.selectedStudent = studentDetailsList[0][0];
        this.selectedStudentSection = studentDetailsList[1][0];
    }

<<<<<<< HEAD
    getClassName(studentSection: any): any{
        return this.classList.find(classs => {
            return classs.dbId == studentSection.parentClass;
        }).name;
    }

    getSectionName(studentSection: any): any{
        return this.sectionList.find(section => {
            return section.id == studentSection.parentDivision;
        }).name;
=======
    downloadClassSectionList(data: any): void {
        this.selectedClass = null;
        this.isLoading = true;
        Promise.all([
            this.classService.getObjectList(this.classService.classs,{}),
            this.classService.getObjectList(this.classService.division,{})
        ]).then(value=>{
            value[0].forEach(classs=>{
                classs.sectionList = value[1]
            })
            this.isLoading = false;
            this.classSectionList = value[0];
            this.classSectionList.forEach( classs => {
                classs.selectedSection = classs.sectionList[0];
            });
            this.selectedClass = this.classSectionList[0];
        },error=>{
            this.isLoading = false;
        });

        // this.classOldService.getClassSectionList(data, this.user.jwt).then(classSectionList => {
        //     this.isLoading = false;
        //     this.classSectionList = classSectionList;
        //     this.classSectionList.forEach( classs => {
        //         classs.selectedSection = classs.sectionList[0];
        //     });
        //     this.selectedClass = this.classSectionList[0];
        // }, error => {
        //     this.isLoading = false;
        // });
>>>>>>> frontend/remove_class_old_service
    }

    changeClassSection(): void {
        let data = {
<<<<<<< HEAD
            id: this.selectedStudentSection.id,
            parentDivision: this.selectedClass.selectedSection.id,
            parentClass: this.selectedClass.dbId,
=======
            id: this.selectedStudent.studentSectionDbId,
            parentDivision: this.selectedClass.selectedSection.id,
            parentStudent: this.selectedStudent.dbId,
            parentClass: this.selectedClass.id,
            parentSession: this.selectedSessionDbId,
>>>>>>> frontend/remove_class_old_service
        };
        this.isLoading = true;
<<<<<<< HEAD
        this.studentService.partiallyUpdateObject(this.studentService.student_section,data).then(response => {
            alert('Class Updated Successfully');
            if (this.selectedStudentSection.id == response.id) {
                this.selectedStudentSection.parentDivision = response.parentDivision;
                this.selectedStudentSection.parentClass = response.parentClass;
=======
        this.studentService.updateStudentSection(data, this.user.jwt).then(response => {
            this.isLoading = false;
            alert(response['message']);
            if (response['status'] === 'success') {
                if (studentDbId === this.selectedStudent.dbId) {
                    this.selectedStudent.className = this.selectedClass.name;
                    this.selectedStudent.sectionName = this.selectedClass.selectedSection.name;
                    this.selectedStudent.sectionDbId = this.selectedClass.selectedSection.id;
                }
>>>>>>> frontend/remove_class_old_service
            }
            this.isLoading = false;
        },error =>{
            this.isLoading = false;
        })        
    }

}
