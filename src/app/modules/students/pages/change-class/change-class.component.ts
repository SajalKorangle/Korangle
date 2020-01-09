import { Component, Input, OnInit } from '@angular/core';

import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import {DataStorage} from "../../../../classes/data-storage";


@Component({
    selector: 'change-class',
    templateUrl: './change-class.component.html',
    styleUrls: ['./change-class.component.css'],
    providers: [ ClassService, StudentOldService ],
})

export class ChangeClassComponent implements OnInit {

    user;

    selectedStudent: any;

    selectedSessionDbId: any;

    selectedClass: any;
    classSectionList = [];

    isLoading = false;
    isStudentListLoading = false;

    constructor (private classService : ClassService,
                 private studentService: StudentOldService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        const data = {
            sessionDbId : this.user.activeSchool.currentSessionDbId,
        };
        this.selectedSessionDbId = this.user.activeSchool.currentSessionDbId;
        this.downloadClassSectionList(data);
    }

    onSessionChange(session: any): void {
        const data = {
            sessionDbId : session.dbId,
        };
        this.selectedSessionDbId = session.dbId;
        this.downloadClassSectionList(data);
    }

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
    }

    changeClassSection(): void {
        let data = {
            id: this.selectedStudent.studentSectionDbId,
            parentDivision: this.selectedClass.selectedSection.id,
            parentStudent: this.selectedStudent.dbId,
            parentClass: this.selectedClass.id,
            parentSession: this.selectedSessionDbId,
        };
        let studentDbId = this.selectedStudent.dbId;
        this.isLoading = true;
        this.studentService.updateStudentSection(data, this.user.jwt).then(response => {
            this.isLoading = false;
            alert(response['message']);
            if (response['status'] === 'success') {
                if (studentDbId === this.selectedStudent.dbId) {
                    this.selectedStudent.className = this.selectedClass.name;
                    this.selectedStudent.sectionName = this.selectedClass.selectedSection.name;
                    this.selectedStudent.sectionDbId = this.selectedClass.selectedSection.id;
                }
            }
        }, error => {
            this.isLoading = false;
        })
    }

}
