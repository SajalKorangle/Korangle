import { Component, Input, OnInit } from '@angular/core';

import { ClassOldService } from '../../../../services/modules/class/class-old.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import {DataStorage} from "../../../../classes/data-storage";


@Component({
    selector: 'change-class',
    templateUrl: './change-class.component.html',
    styleUrls: ['./change-class.component.css'],
    providers: [ ClassOldService, StudentOldService ],
})

export class ChangeClassComponent implements OnInit {

    user;

    selectedStudent: any;

    selectedSessionDbId: any;

    selectedClass: any;
    classSectionList = [];

    isLoading = false;
    isStudentListLoading = false;

    constructor (private classService: ClassOldService,
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
        this.studentService.updateStudentSection(data, this.user.jwt).then(response => {
            this.isLoading = false;
            alert(response['message']);
            if (response['status'] === 'success') {
                if (studentDbId === this.selectedStudent.dbId) {
                    this.selectedStudent.className = this.selectedClass.name;
                    this.selectedStudent.sectionName = this.selectedClass.selectedSection.name;
                    this.selectedStudent.sectionDbId = this.selectedClass.selectedSection.dbId;
                }
            }
        }, error => {
            this.isLoading = false;
        })
    }

}
