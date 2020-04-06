import {Component, Input, OnInit} from '@angular/core';

import { AttendanceOldService } from '../../../../services/modules/attendance/attendance-old.service';

import { ClassService } from '../../../../services/modules/class/class.service';


import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {EmployeeOldService} from '../../../../services/modules/employee/employee-old.service';
import {DataStorage} from "../../../../classes/data-storage";
import {SchoolService} from "../../../../services/modules/school/school.service";

@Component({
  selector: 'assign-class',
  templateUrl: './assign-class.component.html',
  styleUrls: ['./assign-class.component.css'],
    providers: [ EmployeeOldService, AttendanceOldService,ClassService, SchoolService ],
})

export class AssignClassComponent implements OnInit {

     user;

    employeeList = [];
    moduleList = [];

    selectedClass: any;

    classSectionList = [];

    pageList = [];
    boardList = [];

    filteredEmployeeList: any;

    myControl = new FormControl();

    selectedEmployee: any;
    selectedEmployeeAttendancePermissionList: any;

    isLoading = false;

    constructor (private employeeService: EmployeeOldService,
                 private attendanceService: AttendanceOldService,
                 private schoolService: SchoolService,                 
                 private classService : ClassService) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        let request_employee_data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        const request_class_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        this.isLoading = true;

        Promise.all([
            this.employeeService.getEmployeeMiniProfileList(request_employee_data, this.user.jwt),
            this.classService.getObjectList(this.classService.classs,{}),
            this.classService.getObjectList(this.classService.division,{}),            
            this.schoolService.getObjectList(this.schoolService.board, {}),
        ]).then(value => {
            value[1].forEach(classs=>{
                classs.sectionList = value[2]
            })
            this.isLoading = false;
            this.initializeEmployeeList(value[0]);
            this.initializeClassSectionList(value[1]);
            this.boardList = value[3];
            this.populatePageList();
        }, error => {
            this.isLoading = false;
        });

    }

    initializeEmployeeList(employeeList: any): void {
        this.employeeList = employeeList.filter(employee => {
            return employee.dateOfLeaving===null;
        });
        this.filteredEmployeeList = this.myControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value: (value as any).name),
            map(value => this.filter(value))
        );
    }

    initializeClassSectionList(classSectionList: any): void {        
        this.classSectionList = classSectionList;
        console.log(this.classSectionList)
        this.classSectionList.forEach( classs => {
            classs.selectedSection = classs.sectionList[0];
        });
        this.selectedClass = this.classSectionList[0];
    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        return this.employeeList.filter(employee => employee.name.toLowerCase().indexOf(value.toLowerCase()) === 0 );
    }

    displayFn(employee?: any) {
        if (employee) {
            return employee.name;
        } else {
            return '';
        }
    }

    getEmployeeAttendancePermissionList(employee: any): void {

        let data = {
            parentEmployee: employee.id,
            sessionId: this.user.activeSchool.currentSessionDbId,
        };
        this.selectedEmployee = employee;
        this.selectedEmployeeAttendancePermissionList = null;
        this.isLoading = true;
        this.attendanceService.getAttendancePermissionList(data, this.user.jwt).then( attendancePermissionList => {
            this.isLoading = false;
            this.selectedEmployeeAttendancePermissionList = attendancePermissionList;
        }, error => {
            this.isLoading = false;
        });

    }

    showAddButton(): boolean {
        let result = true;
        this.selectedEmployeeAttendancePermissionList.every(attendancePermission => {
            if (attendancePermission.parentDivision === this.selectedClass.selectedSection.id
                && attendancePermission.parentClass === this.selectedClass.id) {
                result = false;
                return false;
            }
            return true;
        });
        return result;
    }

    showClassSectionName(classDbId: number, sectionDbId: number): any {
        let result = '';
        this.classSectionList.every(classs => {
            classs.sectionList.every(section => {
                if (section.id === sectionDbId && classs.id === classDbId) {
                    result = classs.name + ', ' + section.name;
                    return false;
                }
                return true;
            });
            if (result !== '') {
                return false;
            }
            return true;
        });
        return result;
    }

    addAttendancePermission(): void {

        let data = {
            parentEmployee: this.selectedEmployee.id,
            parentSession: this.user.activeSchool.currentSessionDbId,
            parentClass: this.selectedClass.id,
            parentDivision: this.selectedClass.selectedSection.id,
        };

        this.isLoading = true;

        this.attendanceService.giveAttendancePermission(data, this.user.jwt).then(result => {
            alert(result.message);
            if (result.status === 'success') {
                this.selectedEmployeeAttendancePermissionList.push(result.data);
            }
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });

    }

    deleteAttendancePermission(attendancePermission: any): void {

        let data = {
            id: attendancePermission.id,
        };

        this.isLoading = true;

        this.attendanceService.deleteAttendancePermission(data, this.user.jwt).then(result => {
            alert(result);
            this.removeFromAttendancePermissionList(data['id']);
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });

    }

    removeFromAttendancePermissionList(id: number): void {
        let index = 0;
        this.selectedEmployeeAttendancePermissionList.every(attendancePermission => {
            if (attendancePermission.id === id) {
                return false;
            }
            ++index;
            return true;
        });
        this.selectedEmployeeAttendancePermissionList.splice(index, 1);
    }

    populatePageList(): void {
        this.pageList.push('Attendance -> Record Stud. Attendance');
        if (this.user.activeSchool.parentBoard==this.boardList[0].id) {
            this.pageList.push('Examination -> Update CCE Marks');
        }
    }

}
