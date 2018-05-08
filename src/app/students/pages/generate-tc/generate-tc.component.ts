import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../../classes/student';
import { Classs } from '../../../classes/classs';
import { Section } from '../../../classes/section';

import { StudentTcProfile } from '../../classes/student-tc-profile';

import { StudentService } from '../../student.service';
import { SchoolService } from '../../../services/school.service';

import { EmitterService } from '../../../services/emitter.service';

@Component({
  selector: 'app-generate-tc',
  templateUrl: './generate-tc.component.html',
  styleUrls: ['./generate-tc.component.css'],
    providers: [ StudentService, SchoolService ],
})
export class GenerateTcComponent implements OnInit {

    @Input() user;

    selectedClass: Classs;
    selectedSection: Section;
    selectedStudent: Student;

    classSectionStudentList: Classs[] = [];

    currentStudent: StudentTcProfile = new StudentTcProfile();

    isLoading = false;
    isStudentListLoading = false;

    selectedSession: any;
    sessionList: any;

    constructor (private studentService: StudentService,
                 private schoolService: SchoolService) { }

    changeSelectedSectionToFirst(): void {
        this.selectedSection = this.selectedClass.sectionList[0];
        this.changeSelectedStudentToFirst();
    }

    changeSelectedStudentToFirst(): void {
        this.selectedStudent = this.selectedSection.studentList[0];
        this.currentStudent.copy(this.selectedStudent);
    }

    handleSessionChange(): void {
        this.getStudentList(this.selectedSession.dbId);
    }

    ngOnInit(): void {
        this.getSessionList();
        this.getStudentList(this.user.schoolCurrentSessionDbId);
    }

    getSessionList(): void {
        this.schoolService.getSessionList(this.user.jwt).then(sessionList => {
            this.sessionList = sessionList;
            this.sessionList.every(session => {
                if (session.dbId === this.user.schoolCurrentSessionDbId) {
                    this.selectedSession = session;
                    return false;
                }
                return true;
            });
        });
    }

    getStudentList(sessionDbId: number): void {
        const data = {
            sessionDbId: sessionDbId,
        };
        this.isStudentListLoading = true;
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(classSectionStudentList => {
            this.isStudentListLoading = false;
            this.classSectionStudentList = [];
            classSectionStudentList.forEach( classs => {
                const tempClass = new Classs();
                tempClass.name = classs.name;
                tempClass.dbId = classs.dbId;
                classs.sectionList.forEach( section => {
                    const tempSection = new Section();
                    tempSection.name = section.name;
                    tempSection.dbId = section.dbId;
                    section.studentList.forEach( student => {
                        const tempStudent = new Student();
                        tempStudent.name = student.name;
                        tempStudent.dbId = student.dbId;
                        tempSection.studentList.push(tempStudent);
                    });
                    tempClass.sectionList.push(tempSection);
                });
                this.classSectionStudentList.push(tempClass);
            });
            if (this.classSectionStudentList.length > 0) {
                this.selectedClass = this.classSectionStudentList[0];
                this.changeSelectedSectionToFirst();
            } else {
                alert('Student needs to be added first, before profile updation');
            }
        }, error => {
            this.isStudentListLoading = false;
        });
    }

    getStudentProfile(): void {
        this.isLoading = true;
        const data = {
            studentDbId: this.selectedStudent.dbId,
            sectionDbId: this.selectedSection.dbId,
        };
        this.studentService.getStudentProfile(data, this.user.jwt).then(
            student => {
                this.isLoading = false;
                const breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    this.currentStudent.copy(student);
                    console.log(this.selectedStudent);
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

    printTCSecondFormat(): void {
        EmitterService.get('print-transfer-certificate-second-format').emit(this.currentStudent);
    }

}
