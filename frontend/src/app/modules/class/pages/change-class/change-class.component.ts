import { Component, Input, OnInit } from '@angular/core';

import { StudentService } from '../../../../services/modules/student/student.service';
import { DataStorage } from '../../../../classes/data-storage';
import { CommonFunctions } from '@modules/common/common-functions';

@Component({
    selector: 'change-class',
    templateUrl: './change-class.component.html',
    styleUrls: ['./change-class.component.css'],
    providers: [StudentService],
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

    constructor(private studentService: StudentService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        const data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
    }

    handleDetailsFromParentStudentFilter(details: any): void {
        this.classList = details.classList;
        this.sectionList = details.sectionList;
        this.classSectionList = this.classList;
        this.classSectionList.forEach((classs) => {
            classs['sectionList'] = this.sectionList;
            classs.selectedSection = this.sectionList[0];
        });
        this.selectedClass = this.classSectionList[0];
    }

    handleStudentListSelection(studentDetailsList: any): void {
        this.selectedStudent = studentDetailsList[0][0];
        this.selectedStudentSection = studentDetailsList[1][0];
    }

    getClassName(studentSection: any): any {
        return this.classList.find((classs) => {
            return classs.id == studentSection.parentClass;
        }).name;
    }

    getSectionName(studentSection: any): any {
        return this.sectionList.find((section) => {
            return section.id == studentSection.parentDivision;
        }).name;
    }

    changeClassSection(): void {
        let data = {
            id: this.selectedStudentSection.id,
            parentDivision: this.selectedClass.selectedSection.id,
            parentClass: this.selectedClass.id,
        };
        this.isLoading = true;
        this.studentService.partiallyUpdateObject(this.studentService.student_section, data).then(
            (response) => {
                alert('Class Updated Successfully');

                let parentEmployee = this.user.activeSchool.employeeId;
                let moduleName = this.user.section.title;
                let taskName = this.user.section.subTitle;
                let moduleList = this.user.activeSchool.moduleList;
                let actionString = " changed class of " + this.selectedStudent.name;
                CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);

                if (this.selectedStudentSection.id == response.id) {
                    this.selectedStudentSection.parentDivision = response.parentDivision;
                    this.selectedStudentSection.parentClass = response.parentClass;
                }
                this.isLoading = false;
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }
}
