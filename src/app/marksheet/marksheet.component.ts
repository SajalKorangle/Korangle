import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../classes/student';
import { Classs } from '../classes/classs';
import { Marksheet } from '../classes/marksheet';
import { ClassStudentListService } from '../services/class-student-list.service';
import { MarksheetService } from '../services/marksheet.service';
import {EmitterService} from "../services/emitter.service";

@Component({
    selector: 'app-marksheet',
    templateUrl: './marksheet.component.html',
    styleUrls: ['./marksheet.component.css'],
    providers: [ ClassStudentListService, MarksheetService ],
})

export class MarksheetComponent implements OnInit {

    @Input() user;

    selectedStudent: Student;
    selectedClass: Classs;
    classList: Classs[];
    marksheet: Marksheet;

    isLoading = false;

    constructor (private classStudentListService: ClassStudentListService,
                 private marksheetService: MarksheetService) { }

    onChangeSelectedClass(selectedClass): void {
        this.selectedClass = selectedClass;
        this.populateSelectStudent();
    }

    populateSelectStudent(): void {
        if (this.selectedClass.studentList.length !== 0) {
            this.selectedStudent = this.selectedClass.studentList[0];
            this.getStudentMarksheet();
        } else {
            this.selectedStudent = null;
        }
    }

    ngOnInit(): void {
        this.marksheet = new Marksheet();
        this.classStudentListService.getIndex().then(
            classStudentList => {
                this.classList = [];
                classStudentList.forEach( classs => {
                    const tempClass = new Classs();
                    tempClass.name = classs.name;
                    tempClass.dbId = classs.dbId;
                    classs.studentList.forEach( student => {
                        const tempStudent = new Student();
                        tempStudent.name = student.name;
                        tempStudent.dbId = student.dbId;
                        tempClass.studentList.push(tempStudent);
                    });
                    this.classList.push(tempClass);
                });
                this.selectedClass = this.classList[0];
                this.populateSelectStudent();
            }
        );
    }

    getStudentMarksheet(): void {
        this.isLoading = true;
        this.marksheetService.getStudentMarksheet(this.selectedStudent.dbId, this.user.jwt).then(
            marksheet => {
                this.isLoading = false;
                if (marksheet.studentDbId === this.selectedStudent.dbId) {
                    this.marksheet = marksheet;
                    // this.marksheet.copy(marksheet);
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

    updateStudentMarksheet(): void {
        this.isLoading = true;
        this.marksheetService.updateStudentMarksheet(this.marksheet, this.user.jwt).then(
            marksheet => {
                this.isLoading = false;
                if (this.selectedStudent.dbId === marksheet.studentDbId) {
                    alert('Marksheet updated successfully');
                    this.marksheet = marksheet;
                    // this.marksheet.copy(marksheet);
                } else {
                    let breakLoop = false;
                    let studentName = '';
                    this.classList.forEach( classs => {
                        classs.studentList.forEach( tempStudent => {
                            if (tempStudent.dbId === marksheet.studentDbId) {
                                studentName = tempStudent.name;
                                breakLoop = true;
                                return;
                            }
                        });
                        if (breakLoop) { return; }
                    });
                    alert('Student: ' + studentName + '\'s marksheet updated successfully');
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

    printMarksheet(): void {
        EmitterService.get('print-marksheet').emit(this.marksheet);
    }

    deleteStudentMarksheet(): void {
        this.isLoading = true;
        this.marksheetService.deleteStudentMarksheet(this.selectedStudent.dbId, this.user.jwt).then(
            marksheet => {
                this.isLoading = false;
                if (this.selectedStudent.dbId === marksheet.studentDbId) {
                    alert('Marksheet deleted successfully');
                    this.marksheet = marksheet;
                    // this.marksheet.copy(marksheet);
                } else {
                    let breakLoop = false;
                    let studentName = '';
                    this.classList.forEach( classs => {
                        classs.studentList.forEach( tempStudent => {
                            if (tempStudent.dbId === marksheet.studentDbId) {
                                studentName = tempStudent.name;
                                breakLoop = true;
                                return;
                            }
                        });
                        if (breakLoop) { return; }
                    });
                    alert('Student: ' + studentName + '\'s marksheet deleted successfully');
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

}
