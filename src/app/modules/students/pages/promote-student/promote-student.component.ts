import { Component, Input, OnInit } from '@angular/core';

import { PromoteStudentServiceAdapter } from './promote-student.service.adapter';

import { StudentOldService } from '../../student-old.service';
import { ClassService } from '../../../../services/class.service';
import {SubjectOldService} from '../../../../services/subject-old.service';
import {ExaminationOldService} from '../../../../services/examination-old.service';

@Component({
  selector: 'promote-student',
  templateUrl: './promote-student.component.html',
  styleUrls: ['./promote-student.component.css'],
    providers: [ StudentOldService, ClassService, SubjectOldService, ExaminationOldService ],
})

export class PromoteStudentComponent implements OnInit {

    @Input() user;

    fromSelectedClass: any;
    fromSelectedSection: any;
    fromClassSectionStudentList = [];

    toSelectedClass: any;
    toClassSectionList = [];
    toStudentList = [];

    serviceAdapter: PromoteStudentServiceAdapter;

    isLoading = false;

    constructor (private studentService: StudentOldService,
                 private classService: ClassService,
                 public subjectService: SubjectOldService,
                 public examinationService: ExaminationOldService) { }

    handleFromSelectedClassChange(): void {
        this.fromSelectedSection = this.fromSelectedClass.sectionList[0];
        this.handleFromSelectedSectionChange();
    }

    handleFromSelectedSectionChange(): void {
        this.fromSelectedSection.studentList.forEach(student => {
            student.selected = false;
            student.className = this.fromSelectedClass.name;
            student.classDbId = this.fromSelectedClass.dbId;
            student.sectionName = this.fromSelectedSection.name;
            student.sectionDbId = this.fromSelectedSection.dbId;
        });
    }

    ngOnInit(): void {

        this.serviceAdapter = new PromoteStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);

        const class_section_list_request_data = {
            sessionDbId : this.user.activeSchool.currentSessionDbId+1,
        };
        const student_mini_profile_list_request_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId+1,
        };
        const class_section_student_list_request_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.isLoading = true;
        Promise.all([
            this.classService.getClassSectionList(class_section_list_request_data, this.user.jwt),
            this.studentService.getStudentMiniProfileList(student_mini_profile_list_request_data, this.user.jwt),
            this.studentService.getClassSectionStudentList(class_section_student_list_request_data, this.user.jwt),
        ]).then( value => {
            console.log(value);
            this.initializeToList(value[0]);
            this.toStudentList = value[1].filter(item => {
                if (item.parentTransferCertificate === null) {
                    return true;
                }
                return false;
            });
            this.initializeFromList(value[2]);

            this.serviceAdapter.initializeData();

        }, error => {
            this.isLoading = false;
        });
    }

    initializeToList(classSectionList: any): void {
        this.toClassSectionList = classSectionList;
        this.toClassSectionList.forEach( classs => {
            classs.selectedSection = classs.sectionList[0];
        });
        this.toSelectedClass = this.toClassSectionList[0];
    }

    initializeFromList(classSectionStudentList: any): void {
        this.fromClassSectionStudentList = classSectionStudentList;
        this.fromClassSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                section.studentList = section.studentList.filter(student => {
                    if (student.parentTransferCertificate === null) {
                        return true;
                    }
                    return false;
                });
            });
        });
        if (this.fromClassSectionStudentList.length > 0) {
            this.fromSelectedClass = this.fromClassSectionStudentList[0];
            this.handleFromSelectedClassChange();
        } else {
            alert('No student exists in this session for promotion');
        }
    }

    promoteStudent(): void {
        let index = 0;
        this.toClassSectionList.every( classs => {
            if (classs.name === this.fromSelectedClass.name) {
                return false;
            }
            ++index;
            return true;
        });
        if (this.toClassSectionList[index].dbId !== this.toSelectedClass.dbId
            && ( (index > 0 && this.toClassSectionList[index-1].dbId !== this.toSelectedClass.dbId)
                    || index === 0) ) {
            alert('Can\'t promote from ' + this.fromSelectedClass.name + ' to ' + this.toSelectedClass.name);
            return;
        }
        let studentPromotionList = this.getStudentPromotionList();
        if (studentPromotionList.length === 0) {
            alert('No student selected for promotion');
            return;
        }
        let data = {
            classDbId: this.toSelectedClass.dbId,
            sectionDbId: this.toSelectedClass.selectedSection.dbId,
            studentList: studentPromotionList,
            parentSession: this.user.activeSchool.currentSessionDbId+1,
        };
        console.log(data);
        this.isLoading = true;
        this.studentService.createStudentSectionList(data, this.user.jwt).then(message => {

            data.studentList.forEach( student => {
                this.addInToList(student, data['sectionDbId'], data['classDbId']);
            });

            this.serviceAdapter.addStudentSubjectsAndTests(data);

        }, error => {
            this.isLoading = false;
        })
    }

    getStudentPromotionList(): any {
        return this.fromSelectedSection.studentList.filter((student) => {
            return student.selected;
        });
    }

    inToList(dbId: number): boolean {
        let result = false;
        this.toStudentList.every(student => {
            if (student.dbId===dbId) {
                result = true;
                return false;
            }
            return true;
        });
        return result
    }

    getFilteredToStudentList(): any {
        return this.toStudentList.filter((student) => {
            if (student.sectionDbId === this.toSelectedClass.selectedSection.dbId &&
                student.classDbId === this.toSelectedClass.dbId) {
                return true;
            }
            return false;
        });
    }

    addInToList(student: any, sectionDbId: any, classDbId: any): void {
        student.selected = false;
        student.sectionDbId = sectionDbId;
        student.classDbId = classDbId;
        this.toStudentList.push(student);
    }

    selectAllStudentsFromList(): void {
        this.fromSelectedSection.studentList.forEach(student => {
            if (!this.inToList(student.dbId)) {
                student.selected = true;
            }
        });
    }

    clearAllStudentsFromList(): void {
        this.fromSelectedSection.studentList.forEach(student => {
            student.selected = false;
        });
    }

    getFromSessionName(): any {
        switch (this.user.activeSchool.currentSessionDbId) {
            case 1:
                return "Session 2017-18";
            case 2:
                return "Session 2018-19";
            case 3:
                return "Session 2019-20";
        }
        return "-";
    }

    getToSessionName(): any {
        switch (this.user.activeSchool.currentSessionDbId+1) {
            case 1:
                return "Session 2017-18";
            case 2:
                return "Session 2018-19";
            case 3:
                return "Session 2019-20";
        }
        return "-";
    }

}
