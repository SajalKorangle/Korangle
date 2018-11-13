import {Component, Input, OnInit} from '@angular/core';

import { Student } from '../../../../classes/student';

import { ClassService } from '../../../../services/class.service';
import { BusStopService } from '../../../../services/bus-stop.service';
import { StudentService } from '../../student.service';

@Component({
  selector: 'add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
    providers: [ ClassService, BusStopService, StudentService ],
})

export class AddStudentComponent implements OnInit {

    @Input() user;

    selectedClass: any;
    selectedSection: any;

    newStudent: Student;

    // classSectionList = [];
    classList = [];
    sectionList = [];

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
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.classService.getClassList(this.user.jwt),
            this.classService.getSectionList(this.user.jwt),
        ]).then(value => {
            this.classList = value[0];
            this.sectionList = value[1];
            this.selectedClass = this.classList[0];
            this.selectedSection = this.sectionList[0];
        });

        /*this.classService.getClassSectionList(data, this.user.jwt).then(
            classSectionList => {
                this.isLoading = false;
                this.classSectionList = classSectionList;
                this.classSectionList.forEach( classs => {
                    classs.selectedSection = classs.sectionList[0];
                });
                this.selectedClass = this.classSectionList[0];
            }
        );*/

        const dataForBusStop = {
            schoolDbId: this.user.activeSchool.dbId,
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

        if (this.newStudent.admissionSessionDbId == 0) {
            this.newStudent.admissionSessionDbId = null;
        }

        if (this.newStudent.name === undefined || this.newStudent.name === '') {
            alert('Name should be populated');
            return;
        }
        if (this.newStudent.fathersName === undefined || this.newStudent.fathersName === '') {
            alert('Father\'s Name should be populated');
            return;
        }
        this.newStudent.classDbId = this.selectedClass.dbId;
        if (this.newStudent.classDbId === undefined || this.newStudent.classDbId === 0) {
            alert('Class should be selected');
            return;
        }
        this.newStudent.sectionDbId = this.selectedSection.dbId;
        if (this.newStudent.sectionDbId === undefined || this.newStudent.sectionDbId === 0) {
            alert('Class should be selected');
            return;
        }
        if (this.newStudent.dateOfBirth === undefined) { this.newStudent.dateOfBirth = this.todaysDate(); }
        if (this.newStudent.mobileNumber === undefined) { this.newStudent.mobileNumber = 0; }
        // if (this.newStudent.totalFees === undefined) { this.newStudent.totalFees = 0; }
        if (this.newStudent.remark === undefined) { this.newStudent.remark = ''; }
        if (this.newStudent.scholarNumber === undefined) { this.newStudent.scholarNumber = 0; }

        this.newStudent.schoolDbId = this.user.activeSchool.dbId;

        this.newStudent.sessionDbId = this.user.activeSchool.currentSessionDbId;

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
