import {Component, Input, OnInit} from '@angular/core';

import { AttendanceService } from '../../attendance.service';

import { ClassService } from '../../../../services/class.service';



import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {EmployeeService} from '../../../employee/employee.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'give-permissions',
  templateUrl: './give-permissions.component.html',
  styleUrls: ['./give-permissions.component.css'],
    providers: [ EmployeeService, AttendanceService, ClassService ],
})

export class GivePermissionsComponent implements OnInit {

     user;

    employeeList = [];
    moduleList = [];

    selectedClass: any;

    classSectionList = [];

    filteredEmployeeList: any;

    myControl = new FormControl();

    selectedEmployee: any;
    selectedEmployeeAttendancePermissionList: any;

    isLoading = false;

    constructor (private employeeService: EmployeeService,
                 private attendanceService: AttendanceService,
                 private classService: ClassService) { }

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
            this.classService.getClassSectionList(request_class_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.initializeEmployeeList(value[0]);
            this.initializeClassSectionList(value[1]);
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
            if (attendancePermission.parentDivision === this.selectedClass.selectedSection.dbId
                && attendancePermission.parentClass === this.selectedClass.dbId) {
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
                if (section.dbId === sectionDbId && classs.dbId === classDbId) {
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
            parentClass: this.selectedClass.dbId,
            parentDivision: this.selectedClass.selectedSection.dbId,
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

}
