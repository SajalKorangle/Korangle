import { Component, OnInit } from '@angular/core';

import { PromoteStudentServiceAdapter } from './promote-student.service.adapter';

import { ClassService } from '../../../../services/modules/class/class.service';
import { CommonFunctions } from '../../../../classes/common-functions';
import { StudentService } from '../../../../services/modules/student/student.service';
import { StudentSection } from '../../../../services/modules/student/models/student-section';
import { DataStorage } from '../../../../classes/data-storage';
import { SchoolService } from './../../../../services/modules/school/school.service';
import { TCService } from './../../../../services/modules/tc/tc.service';
@Component({
    selector: 'promote-student',
    templateUrl: './promote-student.component.html',
    styleUrls: ['./promote-student.component.css'],
    providers: [SchoolService, StudentService, ClassService, TCService],
})
export class PromoteStudentComponent implements OnInit {
    sessionList = [];

    STUDENT_LIMITER = 200;

    user;

    // From Service Adapter
    classList: any;
    sectionList: any;
    studentSectionListOne: any;
    studentSectionListTwo: any;
    studentList: any;

    fromSelectedClass: any;
    fromSelectedSection: any;

    toSelectedClass: any;
    toSelectedSection: any;

    unPromotedStudentList: any;

    newPromotedList = [];

    serviceAdapter: PromoteStudentServiceAdapter;

    isLoading = false;

    constructor(
        public schoolService: SchoolService,
        public studentService: StudentService,
        public classService: ClassService,
        public tcService: TCService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        if (this.isMobileMenu()) {
            return;
        }

        this.serviceAdapter = new PromoteStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getSessionName(sessionId: number): any {
        return this.sessionList.find((session) => {
            return session.id == sessionId;
        }).name;
    }

    isMobileMenu(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    handleFromSelectedClassChange(value: any): void {
        this.fromSelectedClass = value;
        this.toSelectedClass = this.getToClassList()[0];
        this.newPromotedList = [];
    }

    handleFromSelectedSectionChange(value: any): void {
        this.fromSelectedSection = value;
        this.newPromotedList = [];
    }

    handleToSelectedClassChange(value: any): void {
        this.toSelectedClass = value;
        this.newPromotedList.forEach((studentSection) => {
            studentSection.parentClass = this.toSelectedClass.id;
        });
    }

    handleToSelectedSectionChange(value: any): void {
        this.toSelectedSection = value;
        this.newPromotedList.forEach((studentSection) => {
            studentSection.parentDivision = this.toSelectedSection.id;
        });
    }

    getToClassList(): any {
        return this.classList.filter((classs) => {
            return classs.orderNumber == this.fromSelectedClass.orderNumber || classs.orderNumber == this.fromSelectedClass.orderNumber - 1;
        });
    }

    selectAllStudentsFromList(): void {
        this.unPromotedStudentList
            .filter((studentSection) => {
                return (
                    studentSection.parentClass == this.fromSelectedClass.id && studentSection.parentDivision == this.fromSelectedSection.id
                );
            })
            .forEach((studentSection) => {
                this.addToNewPromotionList(studentSection);
            });
    }

    clearAllStudentsFromList(): void {
        this.newPromotedList = [];
    }

    getFilteredStudentSectionListOne(): any {
        return this.studentSectionListOne.filter((studentSection) => {
            return studentSection.parentClass == this.fromSelectedClass.id && studentSection.parentDivision == this.fromSelectedSection.id;
        });
    }

    getFilteredStudentSectionListTwo(): any {
        return this.studentSectionListTwo.filter((studentSection) => {
            return studentSection.parentClass == this.toSelectedClass.id && studentSection.parentDivision == this.toSelectedSection.id;
        });
    }

    handlePromotionChange(studentSection: any, value: any): void {
        if (value && !this.inNewPromotionList(studentSection)) {
            this.addToNewPromotionList(studentSection);
        } else {
            this.deleteFromNewPromotionList(studentSection);
        }
    }

    addToNewPromotionList(studentSection: any): void {
        let tempObject = new StudentSection();
        tempObject.parentClass = this.toSelectedClass.id;
        tempObject.parentDivision = this.toSelectedSection.id;
        tempObject.parentStudent = studentSection.parentStudent;
        tempObject.parentSession = this.user.activeSchool.currentSessionDbId + 1;
        this.newPromotedList.push(tempObject);
    }

    deleteFromNewPromotionList(studentSection: any): void {
        this.newPromotedList = this.newPromotedList.filter((item) => {
            return item.parentStudent != studentSection.parentStudent;
        });
    }

    inUnPromotedStudentList(studentSection: any): boolean {
        return (
            this.unPromotedStudentList.find((item) => {
                return studentSection.parentStudent == item.parentStudent;
            }) != undefined
        );
    }

    inNewPromotionList(studentSection: any): boolean {
        return (
            this.newPromotedList.find((item) => {
                return studentSection.parentStudent == item.parentStudent;
            }) != undefined
        );
    }

    getStudent(studentId: any): any {
        return this.studentList.find((student) => {
            return student.id == studentId;
        });
    }
}
