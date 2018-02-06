import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../classes/student';
import { Classs } from '../../classes/classs';
import { Fee } from '../../classes/fee';
import { ClassStudentListService } from '../../services/class-student-list.service';
import { StudentService } from '../../services/student.service';
import { NewFeeReceiptService } from '../../services/new-fee-receipt.service';
import { AuthenticationService } from '../../services/authentication.service';
import {NewConcessionService} from '../../services/new-concession.service';
import {Concession} from '../../classes/concession';

import moment = require('moment');

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
    providers: [ ClassStudentListService, StudentService, NewFeeReceiptService, AuthenticationService, NewConcessionService ],
})
export class StudentProfileComponent implements OnInit {

    @Input() user;

  selectedStudent: Student;
  selectedClass: Classs;
  classList: Classs[];
  newFeeReceipt: Fee;
  newConcession: Concession;
  // noStudentForSelectedClass = true;
  currentStudent: Student = new Student();

  isLoading = false;

    constructor (private classStudentListService: ClassStudentListService,
                 private studentService: StudentService,
                 private newFeeReceiptService: NewFeeReceiptService,
                 private newConcessionService: NewConcessionService,
                 private authenticationService: AuthenticationService) { }

    onChangeSelectedClass(selectedClass): void {
        this.selectedClass = selectedClass;
        this.populateSelectStudent();
    }

    populateSelectStudent(): void {
        if (this.selectedClass.studentList.length !== 0) {
            this.selectedStudent = this.selectedClass.studentList[0];
            // this.getStudentData();
        } else {
            this.selectedStudent = null;
        }
    }

    ngOnInit(): void {
        this.newFeeReceipt = new Fee();
        this.newFeeReceipt.generationDateTime = moment(new Date()).format('YYYY-MM-DD');
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
                this.newFeeReceipt.receiptNumber = student.overAllLastFeeReceiptNumber + 1;
                // alert(this.newFeeReceipt.receiptNumber);
                /*else {
                    alert("Error: Select student again");
                }*/
                /*else {
                    this.classList.forEach( classs => {
                        classs.studentList.forEach( tempStudent => {
                            if (tempStudent.dbId === student.dbId) {
                                tempStudent.copy(student);
                                breakLoop = true;
                                return;
                            }
                        });
                        if (breakLoop) { return; }
                    });
                }*/
            }, error => {
                this.isLoading = false;
            }
        );
    }

    updateProfile(): void {
        if (this.currentStudent.familySSMID
            && this.currentStudent.familySSMID.toString().length !== 0
            && this.currentStudent.familySSMID.toString().length !== 9) {
            alert('Number of digits in Family SSMID should be 9');
            return;
        }
        if (this.currentStudent.childSSMID
            && this.currentStudent.childSSMID.toString().length !== 0
            && this.currentStudent.childSSMID.toString().length !== 9) {
            alert('Number of digits in Child SSMID should be 9');
            return;
        }
        if (this.currentStudent.aadharNum
            && this.currentStudent.aadharNum.toString().length !== 0
            && this.currentStudent.aadharNum.toString().length !== 12) {
            alert('Number of digits in Aadhar No. should be 12');
            return;
        }
        this.isLoading = true;
        this.studentService.updateStudentData(this.currentStudent).then(
            student => {
                this.isLoading = false;
                let breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    alert('Student updated successfully');
                } else {
                    this.classList.forEach( classs => {
                        classs.studentList.forEach( tempStudent => {
                            if (tempStudent.dbId === student.dbId) {
                                tempStudent.copy(student);
                                breakLoop = true;
                                return;
                            }
                        });
                        if (breakLoop) { return; }
                    });
                    alert('Student: ' + student.name + ' updated successfully');
                }
            }
        );
    }

    deleteProfile(): void {
        if (!confirm('Are you sure you want to delete ' + this.currentStudent.name + '\'s profile.')) {
            return;
        }
        this.isLoading = true;
        this.studentService.deleteStudentProfile(this.currentStudent.dbId).then( data => {
            alert(data['message']);
            this.isLoading = false;
            let studentIndex = 0;
            if (data['status'] === 'success') {
                this.selectedClass.studentList.forEach( (student, index) => {
                    if (student.dbId === data['studentDbId']) {
                        studentIndex = index;
                    }
                });
            }
            this.selectedClass.studentList.splice(studentIndex, 1);
            this.populateSelectStudent();
        }, error => {
            this.isLoading = false;
            alert('Server Error: Contact admin');
        });
    }

    checkFieldChanged(selectedValue, currentValue): boolean {
        if (selectedValue !== currentValue && !(selectedValue == null && currentValue === '')) {
            return true;
        }
        return false;
    }

    /*printFeeReceipt(fee: Fee): void {
        fee.fatherName = this.selectedStudent.fathersName;
        fee.studentName ` = this.selectedStudent.name;
        fee.className =  this.selectedClass.name;
        EmitterService.get('print-fee-receipt').emit(fee);
    }

    createNewFeeReceipt(): void {
        EmitterService.get('new-fee-receipt-modal').emit(this.newFeeReceipt);
    }*/

    /*checkAuthentication(): void {
        this.authenticationService.checkAuthentication().then(
            response => {
                console.log(response);
            }
        );
    }

    login(): void {
        this.authenticationService.login('arnava', 'harshal03').then(
            response => {
                console.log(response);
            }
        )
    }

    logout(): void {
        this.authenticationService.logout().then(
            response => {
                console.log(response);
            }
        )
    }*/

}
