import { Component, Input, OnInit } from '@angular/core';

import { AttendanceOldService } from '../../../../services/modules/attendance/attendance-old.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { ATTENDANCE_STATUS_LIST } from '../../classes/constants';
import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { DataStorage } from '../../../../classes/data-storage';
import { DeclareHolidaysServiceAdapter } from './declare-holidays.service.adapter';
import { AttendanceService } from '../../../../services/modules/attendance/attendance.service';

@Component({
    selector: 'declare-holidays',
    templateUrl: './declare-holidays.component.html',
    styleUrls: ['./declare-holidays.component.css'],
    providers: [AttendanceOldService, StudentOldService, EmployeeOldService, AttendanceService],
})
export class DeclareHolidaysComponent implements OnInit {
    user;

    classSectionStudentList = [];
    employeeList = [];

    by = 'date';

    startDate = null;
    endDate = null;

    serviceAdapter: DeclareHolidaysServiceAdapter;

    isLoading = false;

    constructor(
        public attendanceService: AttendanceOldService,
        public attendanceService2: AttendanceService,
        public studentService: StudentOldService,
        public employeeService: EmployeeOldService
    ) {}
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new DeclareHolidaysServiceAdapter();
        this.isLoading = true;
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    initializeEmployeeList(employeeList: any): void {
        this.employeeList = employeeList.filter((employee) => {
            return employee.dateOfLeaving === null && employee.isNonSalariedEmployee === false;
        });
        this.employeeList.forEach((employee) => {
            employee.selected = false;
        });
    }

    initializeClassSectionStudentList(classSectionStudentList: any): void {
        classSectionStudentList.forEach((classs) => {
            let tempClass = {
                name: classs.name,
                dbId: classs.dbId,
                sectionList: [],
            };
            classs.sectionList.forEach((section) => {
                let tempSection = {
                    name: section.name,
                    dbId: section.dbId,
                    selected: false,
                    studentList: [],
                };
                section.studentList.forEach((student) => {
                    if (student.parentTransferCertificate === null) {
                        let tempStudent = {
                            name: student.name,
                            dbId: student.dbId,
                            scholarNumber: student.scholarNumber,
                        };
                        tempSection.studentList.push(tempStudent);
                    }
                });
                if (tempSection.studentList.length > 0) {
                    tempClass.sectionList.push(tempSection);
                }
            });
            if (tempClass.sectionList.length > 0) {
                this.classSectionStudentList.push(tempClass);
            }
        });
    }

    // Server Handling - 1
    prepareEmployeeAttendanceStatusListData(): any {
        let employeeAttendanceStatusListData = [];
        this.employeeList.forEach((employee) => {
            if (employee.selected) {
                this.getDateList().forEach((date) => {
                    let tempData = {
                        parentEmployee: employee.id,
                        dateOfAttendance: this.formatDate(date.toString(), ''),
                        status: ATTENDANCE_STATUS_LIST[2],
                    };
                    employeeAttendanceStatusListData.push(tempData);
                });
            }
        });
        return employeeAttendanceStatusListData;
    }

    prepareStudentAttendanceStatusListData(): any {
        let studentAttendanceStatusListData = [];
        this.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (section.selected) {
                    section.studentList.forEach((student) => {
                        this.getDateList().forEach((date) => {
                            let tempData = {
                                parentStudent: student.dbId,
                                dateOfAttendance: this.formatDate(date.toString(), ''),
                                status: ATTENDANCE_STATUS_LIST[2],
                            };
                            studentAttendanceStatusListData.push(tempData);
                        });
                    });
                }
            });
        });
        return studentAttendanceStatusListData;
    }

    // Server Handling - 2
    getStudentIdList(): any {
        let studentIdList = [];
        this.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (section.selected) {
                    section.studentList.forEach((student) => {
                        studentIdList.push(student.dbId);
                    });
                }
            });
        });
        return studentIdList;
    }

    getEmployeeIdList(): any {
        let employeeIdList = [];
        this.employeeList.forEach((employee) => {
            if (employee.selected) {
                employeeIdList.push(employee.id);
            }
        });
        return employeeIdList;
    }

    // Called from Html files
    unselectAllEmployees(): void {
        this.employeeList.forEach((employee) => {
            employee.selected = false;
        });
    }

    selectAllEmployees(): void {
        this.employeeList.forEach((employee) => {
            employee.selected = true;
        });
    }

    getSelectedEmployees(): any {
        let all = true;
        let selectedEmployees = '';
        this.employeeList.forEach((employee) => {
            if (employee.selected) {
                selectedEmployees += employee.name + ', ';
            } else {
                all = false;
            }
        });
        return all
            ? 'All Employees Selected'
            : selectedEmployees.length > 0
            ? selectedEmployees.substr(0, selectedEmployees.length - 2)
            : 'No Employee Selected';
    }

    unselectAllClasses(): void {
        this.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
            });
        });
    }

    selectAllClasses(): void {
        this.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = true;
            });
        });
    }

    getSelectedClasses(): any {
        let all = true;
        let selectedClasses = '';
        this.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (section.selected) {
                    selectedClasses += classs.name + (classs.sectionList.length > 1 ? ' (' + section.name + ')' : '') + ', ';
                } else {
                    all = false;
                }
            });
        });
        return all
            ? 'All Classes Selected'
            : selectedClasses.length > 0
            ? selectedClasses.substr(0, selectedClasses.length - 2)
            : 'No Class Selected';
    }

    onDateSelected(event: any): void {
        this.startDate = this.formatDate(event, '');
        this.endDate = this.startDate;
    }

    onStartDateSelected(event: any): void {
        this.startDate = this.formatDate(event, '');
    }

    onEndDateSelected(event: any): void {
        this.endDate = this.formatDate(event, '');
    }

    formatDate(dateStr: any, status: any): any {
        let d = new Date(dateStr);

        if (status === 'firstDate') {
            d = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (status === 'lastDate') {
            d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getDateList(): any {
        let dateList = [];

        let tempDate = new Date(this.startDate);
        let lastDate = new Date(this.endDate);

        while (tempDate <= lastDate) {
            dateList.push(new Date(tempDate));
            tempDate.setDate(tempDate.getDate() + 1);
        }

        return dateList;
    }
}
