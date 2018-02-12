import {Component, Input, OnInit} from '@angular/core';

import { Student } from '../classes/student';
import { Classs } from '../classes/classs';
import { ClassListService } from '../services/class-list.service';
import { NewStudentService } from '../services/new-student.service';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.css'],
    providers: [ ClassListService, NewStudentService ],
})
export class NewStudentComponent implements OnInit {

    @Input() user;

  newStudent: Student;
  // selectedClass: Classs;
  classList: Classs[];

  isLoading = false;

    constructor (private classListService: ClassListService,
                 private newStudentService: NewStudentService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.newStudent = new Student();
        this.newStudent.dateOfBirth = this.todaysDate();
        this.classListService.getClassList().then(
            classStudentList => {
                this.isLoading = false;
                this.classList = [];
                classStudentList.forEach( classs => {
                    const tempClass = new Classs();
                    tempClass.name = classs.name;
                    tempClass.dbId = classs.dbId;
                    this.classList.push(tempClass);
                });
                // this.selectedClass = this.classList[0];
            }
        );
    }

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    createNewStudent(): void {
        if (this.newStudent.name === undefined || this.newStudent.name === '') {
            alert('Name should be populated');
            return;
        }
        if (this.newStudent.fathersName === undefined || this.newStudent.fathersName === '') {
            alert('Father\'s Name should be populated');
            return;
        }
        if (this.newStudent.classDbId === undefined || this.newStudent.classDbId === 0 ) {
            alert('Class should be selected');
            return;
        }
        if (this.newStudent.dateOfBirth === undefined) { this.newStudent.dateOfBirth = ''; }
        if (this.newStudent.mobileNumber === undefined) { this.newStudent.mobileNumber = 0; }
        if (this.newStudent.totalFees === undefined) { this.newStudent.totalFees = 0; }
        if (this.newStudent.remark === undefined) { this.newStudent.remark = ''; }
        if (this.newStudent.scholarNumber === undefined) { this.newStudent.scholarNumber = 0; }
        this.isLoading = true;
        // this.newStudent.classDbId = this.selectedClass.dbId;
        this.newStudentService.createNewStudent(this.newStudent, this.user.jwt).then(
            data => {
                this.isLoading = false;
                if (data === 'okay') {
                    alert('Student Profile created successfully');
                    this.newStudent = new Student();
                } else {
                    alert('Student Profile creation Failed');
                }
            }, error => {
                this.isLoading = false;
                alert('Server Error: Contact admin');
            }
        );
    }

    /*checkFieldChanged(selectedValue, currentValue): boolean {
        if (selectedValue !== currentValue && !(selectedValue == null && currentValue === '')) {
            return true;
        }
        return false;
    }*/

    checkLength(value: any) {
        if (value && value.toString().length > 0) {
            return true;
        }
        return false;
    }

    checkRight(value: any, rightValue: number) {
        if (value && value.toString().length === rightValue) {
            return true;
        }
        return false;
    }

}
