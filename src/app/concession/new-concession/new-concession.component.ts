import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../classes/student';
import { Classs } from '../../classes/classs';
import { ClassStudentListService } from '../../services/class-student-list.service';
import { StudentService } from '../../services/student.service';
import { NewConcessionService } from '../../services/new-concession.service';
import {Concession} from '../../classes/concession';

@Component({
    selector: 'app-new-concession',
    templateUrl: './new-concession.component.html',
    styleUrls: ['./new-concession.component.css'],
    providers: [ ClassStudentListService, StudentService, NewConcessionService ],
})
export class NewConcessionComponent implements OnInit {

    @Input() user;

    selectedStudent: Student;
    selectedClass: Classs;
    classList: Classs[];
    newConcession: Concession;
    currentStudent: Student = new Student();

    isLoading = false;

    constructor (private classStudentListService: ClassStudentListService,
                 private studentService: StudentService,
                 private newConcessionService: NewConcessionService) { }

    onChangeSelectedClass(selectedClass): void {
        this.selectedClass = selectedClass;
        this.populateSelectStudent();
    }

    populateSelectStudent(): void {
        if (this.selectedClass.studentList.length !== 0) {
            // this.noStudentForSelectedClass = false;
            this.selectedStudent = this.selectedClass.studentList[0];
            this.getStudentData();
        } else {
            // this.noStudentForSelectedClass = true;
            this.selectedStudent = null;
        }
    }

    ngOnInit(): void {
        this.newConcession = new Concession();
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

    getStudentData(): void {
        this.isLoading = true;
        this.studentService.getStudentData(this.selectedStudent.dbId).then(
            student => {
                // console.log(student);
                this.isLoading = false;
                const breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    this.currentStudent.copyWithoutFeesAndConcession(student);
                }
                // console.log(student);
                if (student.overAllLastFeeReceiptNumber === null || student.overAllLastFeeReceiptNumber === '') {
                    student.overAllLastFeeReceiptNumber = 0;
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

    submitConcession(): void {
        if (this.newConcession.amount === undefined || this.newConcession.amount === 0) {
            alert('Amount should be populated');
            return;
        }
        if (this.newConcession.remark === undefined) { this.newConcession.remark = ''; }
        this.isLoading = true;
        this.newConcession.studentDbId = this.selectedStudent.dbId;
        this.newConcessionService.submitStudentConcession(this.newConcession).then(
            data => {
                this.isLoading = false;
                if (data.status === 'success') {
                    alert(data.message);
                    const student = data.studentData;
                    if (this.selectedStudent.dbId === student.dbId) {
                        this.selectedStudent.copy(student);
                        this.currentStudent.copyWithoutFeesAndConcession(student);
                    }
                    if (student.overAllLastFeeReceiptNumber === null || student.overAllLastFeeReceiptNumber === '') {
                        student.overAllLastFeeReceiptNumber = 0;
                    }
                } else {
                    alert(data.message);
                }
            }, error => {
                this.isLoading = false;
                alert('Server error: Contact Admin');
            }
        );

    }

}
