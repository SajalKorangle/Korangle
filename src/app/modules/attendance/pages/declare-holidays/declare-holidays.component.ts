import {Component, Input, OnInit } from '@angular/core';

import { AttendanceService } from '../../attendance.service';
import {StudentOldService} from '../../../students/student-old.service';
import {ATTENDANCE_STATUS_LIST} from '../../classes/constants';
import {EmployeeService} from '../../../employee/employee.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'declare-holidays',
  templateUrl: './declare-holidays.component.html',
  styleUrls: ['./declare-holidays.component.css'],
    providers: [ AttendanceService, StudentOldService, EmployeeService ],
})

export class DeclareHolidaysComponent implements OnInit {

     user;

    classSectionStudentList = [];
    employeeList = [];

    by = 'date';

    startDate = null;
    endDate = null;

    isLoading = false;

    constructor (private attendanceService: AttendanceService,
                 private studentService: StudentOldService,
                 private employeeService: EmployeeService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        let request_student_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        const request_employee_data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        this.isLoading = true;

        Promise.all([
            this.studentService.getClassSectionStudentList(request_student_data, this.user.jwt),
            this.employeeService.getEmployeeMiniProfileList(request_employee_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.initializeClassSectionStudentList(value[0]);
            this.initializeEmployeeList(value[1]);
        }, error => {
            this.isLoading = false;
        });

    }

    initializeEmployeeList(employeeList: any): void {
        this.employeeList = employeeList.filter(employee => {
            return employee.dateOfLeaving===null;
        });
        this.employeeList.forEach(employee => {
            employee.selected = false;
        });
    }

    initializeClassSectionStudentList(classSectionStudentList: any): void {
        classSectionStudentList.forEach( classs => {
            let tempClass = {
                name: classs.name,
                dbId: classs.dbId,
                sectionList: [],
            };
            classs.sectionList.forEach( section => {
                let tempSection = {
                    name: section.name,
                    dbId: section.dbId,
                    selected: false,
                    studentList: [],
                };
                section.studentList.forEach( student => {
                    if (student.parentTransferCertificate === null) {
                        let tempStudent = {
                            name: student.name,
                            dbId: student.dbId,
                            scholarNumber: student.scholarNumber
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
        this.employeeList.forEach(employee => {
            if (employee.selected) {
                this.getDateList().forEach(date => {
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
        this.classSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                if (section.selected) {
                    section.studentList.forEach(student => {
                        this.getDateList().forEach(date => {
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

    declareHoliday(): void {

        let student_data = this.prepareStudentAttendanceStatusListData();
        let employee_data = this.prepareEmployeeAttendanceStatusListData();

        if (student_data.length === 0 && employee_data.length === 0) {
            alert('Nothing to update');
            return;
        }

        this.isLoading = true;
        Promise.all([
            this.attendanceService.recordStudentAttendance(student_data, this.user.jwt),
            this.attendanceService.recordEmployeeAttendance(employee_data, this.user.jwt)
        ]).then(response => {
            this.isLoading = false;
            alert('Holidays recorded successfully');
        }, error => {
            this.isLoading = false;
        });

    }

    // Server Handling - 2
    getStudentIdList(): any {
        let studentIdList = [];
        this.classSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                if (section.selected) {
                    section.studentList.forEach(student => {
                        studentIdList.push(student.dbId);
                    });
                }
            });
        });
        return studentIdList;
    }

    getEmployeeIdList(): any {
        let employeeIdList = [];
        this.employeeList.forEach(employee => {
            if(employee.selected) {
                employeeIdList.push(employee.id);
            }
        });
        return employeeIdList;
    }

    deleteAttendance(): void {

        if (!confirm('Are you sure, you want to delete all the attendance records for selected persons and dates')) {
            return;
        }

        let studentList = this.getStudentIdList();
        let employeeList = this.getEmployeeIdList();

        if (studentList.length === 0 && employeeList.length === 0) {
            alert('Nothing to delete');
            return;
        }

        let student_data = {
            studentIdList: studentList,
            startDate: this.startDate,
            endDate: this.endDate,
        };
        let employee_data = {
            employeeIdList: employeeList,
            startDate: this.startDate,
            endDate: this.endDate,
        };

        this.isLoading = true;
        Promise.all([
            this.attendanceService.deleteStudentAttendance(student_data, this.user.jwt),
            this.attendanceService.deleteEmployeeAttendance(employee_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            alert('All records for the selected dates are deleted');
        }, error => {
            this.isLoading = false;
        });

    }

    // Called from Html files
    unselectAllEmployees(): void {
        this.employeeList.forEach(employee => {
            employee.selected = false;
        });
    };

    selectAllEmployees(): void {
        this.employeeList.forEach(employee => {
            employee.selected = true;
        });
    };

    getSelectedEmployees(): any {
        let all = true;
        let selectedEmployees = '';
        this.employeeList.forEach(employee => {
                if (employee.selected) {
                    selectedEmployees += employee.name + ', ';
                } else {
                    all = false;
                }
        });
        return (all ?
            'All Employees Selected' : (selectedEmployees.length > 0) ?
                selectedEmployees.substr(0, selectedEmployees.length-2) : 'No Employee Selected');
    }

    unselectAllClasses(): void {
        this.classSectionStudentList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = false;
                });
            }
        );
    };

    selectAllClasses(): void {
        this.classSectionStudentList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = true;
                });
            }
        );
    };

    getSelectedClasses(): any {
        let all = true;
        let selectedClasses = '';
        this.classSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                if (section.selected) {
                    selectedClasses += classs.name + (classs.sectionList.length > 1 ? ' (' + section.name + ')': '') + ', ';
                } else {
                    all = false;
                }
            });
        });
        return (all ?
            'All Classes Selected' : (selectedClasses.length > 0) ?
                selectedClasses.substr(0, selectedClasses.length-2) : 'No Class Selected');
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

        while(tempDate <= lastDate) {
            dateList.push(new Date(tempDate));
            tempDate.setDate(tempDate.getDate() + 1);
        }

        return dateList;
    }

}
