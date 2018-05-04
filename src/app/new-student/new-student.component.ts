import {Component, Input, OnInit} from '@angular/core';

import { Student } from '../classes/student';

import { ClassService } from '../services/class.service';
import { BusStopService } from '../services/bus-stop.service';
import { StudentService } from '../students/student.service';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.css'],
    providers: [ ClassService, BusStopService, StudentService ],
})

export class NewStudentComponent implements OnInit {

    @Input() user;

    selectedClass: any;

    newStudent: Student;
    classSectionList = [];

    busStopList = [];

    isLoading = false;

    constructor (private classService: ClassService,
                 private busStopService: BusStopService,
                 private studentService: StudentService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.newStudent = new Student();
        this.newStudent.dateOfBirth = this.todaysDate();

        const data = {
            sessionDbId: this.user.schoolCurrentSessionDbId,
        }

        this.classService.getClassSectionList(data, this.user.jwt).then(
            classSectionList => {
                this.isLoading = false;
                this.classSectionList = classSectionList;
                this.classSectionList.forEach( classs => {
                    classs.selectedSection = classs.sectionList[0];
                });
                this.selectedClass = this.classSectionList[0];
            }
        );

        const dataForBusStop = {
            schoolDbId: this.user.schoolDbId,
        };

        this.busStopService.getBusStopList(dataForBusStop, this.user.jwt).then( busStopList => {
            this.busStopList = busStopList;
        });
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

        if (this.newStudent.busStopDbId == 0) {
            this.newStudent.busStopDbId = null;
        }

        if (this.newStudent.name === undefined || this.newStudent.name === '') {
            alert('Name should be populated');
            return;
        }
        if (this.newStudent.fathersName === undefined || this.newStudent.fathersName === '') {
            alert('Father\'s Name should be populated');
            return;
        }
        this.newStudent.sectionDbId = this.selectedClass.selectedSection.dbId;
        if (this.newStudent.sectionDbId === undefined || this.newStudent.sectionDbId === 0) {
            alert('Class should be selected');
            return;
        }
        if (this.newStudent.dateOfBirth === undefined) { this.newStudent.dateOfBirth = this.todaysDate(); }
        if (this.newStudent.mobileNumber === undefined) { this.newStudent.mobileNumber = 0; }
        if (this.newStudent.totalFees === undefined) { this.newStudent.totalFees = 0; }
        if (this.newStudent.remark === undefined) { this.newStudent.remark = ''; }
        if (this.newStudent.scholarNumber === undefined) { this.newStudent.scholarNumber = 0; }

        this.isLoading = true;

        this.studentService.createNewStudent(this.newStudent, this.user.jwt).then(
            data => {
                this.isLoading = false;
                alert(data.message);
                this.newStudent = new Student();
                this.newStudent.dateOfBirth = this.todaysDate();
            }, error => {
                this.isLoading = false;
                alert('Server Error: Contact admin');
            }
        );
    }

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
