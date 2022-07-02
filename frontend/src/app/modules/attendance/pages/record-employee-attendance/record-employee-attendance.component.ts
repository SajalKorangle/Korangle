import { Component, Input, OnInit } from '@angular/core';

import { AttendanceOldService } from '../../../../services/modules/attendance/attendance-old.service';

import { ATTENDANCE_STATUS_LIST } from '../../classes/constants';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_EMPLOYEE_ATTENDANCE } from '../../../../print/print-routes.constants';
import { ExcelService } from '../../../../excel/excel-service';
import { DataStorage } from '../../../../classes/data-storage';
import { isMobile } from '../../../../classes/common';

@Component({
    selector: 'record-employee-attendance',
    templateUrl: './record-employee-attendance.component.html',
    styleUrls: ['./record-employee-attendance.component.css'],
    providers: [AttendanceOldService, EmployeeOldService],
})
export class RecordEmployeeAttendanceComponent implements OnInit {
    user;

    employeeList: any;

    by = 'date';

    startDate = null;
    endDate = null;

    showEmployeeList = false;

    employeeAttendanceStatusList: any;

    isInitialLoading = false;

    isLoading = false;

    attendanceStatusList = ATTENDANCE_STATUS_LIST;

    constructor(
        private attendanceService: AttendanceOldService,
        private employeeService: EmployeeOldService,
        private excelService: ExcelService,
        private printService: PrintService
    ) {}

    // Server Handling - Initial
    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        let request_employee_data = {
            parentSchool: this.user.activeSchool.dbId,
            isNonSalariedEmployee: false,
        };

        this.isInitialLoading = true;

        Promise.all([this.employeeService.getEmployeeMiniProfileList(request_employee_data, this.user.jwt)]).then(
            (value) => {
                this.isInitialLoading = false;
                this.initializeEmployeeList(value[0]);
            },
            (error) => {
                this.isInitialLoading = false;
            }
        );
    }

    initializeEmployeeList(employeeList: any): void {
        this.employeeList = employeeList.filter((employee) => {
            return employee.dateOfLeaving === null && employee.isNonSalariedEmployee === false;
        });
    }

    // Server Handling - 1
    getEmployeeIdList(): any {
        let employeeIdList = [];
        this.employeeList.forEach((employee) => {
            employeeIdList.push(employee.id);
        });
        return employeeIdList;
    }

    getEmployeesAttendanceStatusList(): void {
        let data = {
            employeeIdList: this.getEmployeeIdList(),
            startDate: this.startDate,
            endDate: this.endDate,
        };

        this.isLoading = true;
        this.showEmployeeList = true;

        this.attendanceService.getEmployeeAttendanceList(data, this.user.jwt).then(
            (attendanceList) => {
                this.isLoading = false;
                this.populateEmployeeAttendanceList(attendanceList);
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    populateEmployeeAttendanceList(attendanceList: any): void {
        this.employeeAttendanceStatusList = [];
        this.employeeList.forEach((employee) => {
            let tempItem = {
                id: employee.id,
                name: employee.name,
                employeeNumber: employee.employeeNumber,
                attendanceStatusList: [],
            };
            let dateList = this.getDateList();
            dateList.forEach((date) => {
                tempItem.attendanceStatusList.push(this.getEmployeeAttendanceStatusObject(employee, date, attendanceList));
            });
            this.employeeAttendanceStatusList.push(tempItem);
        });
    }

    getEmployeeAttendanceStatusObject(employee: any, date: any, attendanceStatusList: any): any {
        let temp = {
            date: date,
            status: null,
        };
        attendanceStatusList.every((employeeAttendanceStatus) => {
            if (
                employeeAttendanceStatus.parentEmployee === employee.id &&
                new Date(employeeAttendanceStatus.dateOfAttendance).getTime() === date.getTime()
            ) {
                temp.status = employeeAttendanceStatus.status;
                return false;
            }
            return true;
        });
        return temp;
    }

    // Server Handling - 2
    prepareEmployeeAttendanceStatusListData(): any {
        let employeeAttendanceStatusListData = [];
        this.employeeAttendanceStatusList.forEach((employee) => {
            employee.attendanceStatusList.forEach((attendanceStatus) => {
                if (attendanceStatus.status !== null) {
                    let tempData = {
                        parentEmployee: employee.id,
                        dateOfAttendance: this.formatDate(attendanceStatus.date.toString(), ''),
                        status: attendanceStatus.status,
                    };
                    employeeAttendanceStatusListData.push(tempData);
                }
            });
        });
        return employeeAttendanceStatusListData;
    }

    updateEmployeeAttendanceList(): void {
        let data = this.prepareEmployeeAttendanceStatusListData();

        if (data.length === 0) {
            alert('Nothing to update');
            return;
        }

        this.isLoading = true;
        this.attendanceService.recordEmployeeAttendance(data, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                alert(response);
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    //Checking if it is in mobile
    checkMobile(): any {
        return isMobile();
    }


    // For Printing

    printEmployeeAttendanceList(): void {
        let value = {
            employeeAttendanceList: this.employeeAttendanceStatusList,
            startDate: this.startDate,
            endDate: this.endDate,
            by: this.by,
        };
        this.printService.navigateToPrintRoute(PRINT_EMPLOYEE_ATTENDANCE, { user: this.user, value });
    }

    // For Downloading
    downloadList(): void {
        let template: any;

        template = [this.getHeaderValues()];

        this.employeeAttendanceStatusList.forEach((employee, index) => {
            template.push(this.getEmployeeDisplayInfo(employee, index));
        });

        this.excelService.downloadFile(template, 'korangle_employee_attendance.csv');
    }

    getHeaderValues(): any {
        let headerValues = [];
        headerValues.push('Serial No.');
        headerValues.push('Name');
        headerValues.push('Employee No.');
        if (this.by === 'date') {
            headerValues.push('Attendance');
        } else {
            headerValues.push('Abs./Total');
            this.getDateList().forEach((date) => {
                headerValues.push(date.getDate());
            });
        }

        return headerValues;
    }

    getEmployeeDisplayInfo(employee: any, index: any): any {
        let employeeDisplay = [];
        employeeDisplay.push(index + 1);
        employeeDisplay.push(employee.name);
        employeeDisplay.push(employee.employeeNumber);
        if (this.by === 'month') {
            employeeDisplay.push(this.getEmployeeRecord(employee));
        }
        employee.attendanceStatusList.forEach((attendanceStatus) => {
            employeeDisplay.push(this.getButtonString(attendanceStatus.status));
        });

        return employeeDisplay;
    }

    // Called from Html files
    declareAllPresent(): void {
        this.employeeAttendanceStatusList.forEach((employee) => {
            employee.attendanceStatusList.forEach((attendanceStatus) => {
                if (attendanceStatus.status !== ATTENDANCE_STATUS_LIST[2]) {
                    attendanceStatus.status = ATTENDANCE_STATUS_LIST[0];
                }
            });
        });
    }

    changeEmployeeAttendanceStatus(temp: any): void {
        if (!temp.status) {
            temp.status = ATTENDANCE_STATUS_LIST[0];
            return;
        }
        let counter = 0;
        for (let i = 0; i < ATTENDANCE_STATUS_LIST.length; ++i) {
            if (ATTENDANCE_STATUS_LIST[i] === temp.status) {
                counter = i;
                break;
            }
        }
        let nextCounter = (counter + 1) % ATTENDANCE_STATUS_LIST.length;
        if (nextCounter === 2) {
            nextCounter = (nextCounter + 1) % ATTENDANCE_STATUS_LIST.length;
        }
        temp.status = ATTENDANCE_STATUS_LIST[nextCounter];
    }

    handleModeChange(event: any): void {
        this.by = event;
        this.startDate = null;
        this.endDate = null;
        this.showEmployeeList = false;
    }

    onDateSelected(event: any): void {
        this.startDate = this.formatDate(event, '');
        this.endDate = this.startDate;
        this.showEmployeeList = false;
    }

    onMonthSelected(event: any): void {
        setTimeout(() => {
            this.startDate = this.formatDate(event, 'firstDate');
            this.endDate = this.formatDate(event, 'lastDate');
            this.showEmployeeList = false;
        }, 100);
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

    getButtonClass(status: any): any {
        let classs = 'btn';
        switch (status) {
            case ATTENDANCE_STATUS_LIST[3]:
                classs += ' btn-info';
                break;
            case ATTENDANCE_STATUS_LIST[2]:
                classs += ' btn-warning';
                break;
            case ATTENDANCE_STATUS_LIST[1]:
                classs += ' btn-danger';
                break;
            case ATTENDANCE_STATUS_LIST[0]:
                classs += ' btn-success';
                break;
        }
        return classs;
    }

    getButtonString(status: any): any {
        let result = 'N';
        if (status) {
            result = status.substring(0, 1);
        }
        if (status === ATTENDANCE_STATUS_LIST[3]) {
            result = result.toLowerCase();
        }
        return result;
    }

    getStatusNumber(status: any): any {
        let count = 0;
        if (status === undefined) {
            this.employeeAttendanceStatusList.forEach((employee) => {
                employee.attendanceStatusList.forEach((attendanceStatus) => {
                    if (attendanceStatus.status === null) {
                        count = count + 1;
                    }
                });
            });
        } else {
            this.employeeAttendanceStatusList.forEach((employee) => {
                employee.attendanceStatusList.forEach((attendanceStatus) => {
                    if (attendanceStatus.status === status) {
                        count = count + 1;
                    }
                });
            });
        }
        return count;
    }

    getEmployeeRecord(employee: any): any {
        let absentCount = 0,
            totalCount = 0;
        employee.attendanceStatusList.forEach((attendanceStatus) => {
            if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[0]) {
                totalCount += 1;
            } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                absentCount += 1;
                totalCount += 1;
            } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[3]) {
                absentCount += 0.5;
                totalCount += 1;
            }
        });
        return absentCount + '/' + totalCount;
    }

    getMatTooltip(employee: any, attendance: any): any {
        let dateStr = this.formatDate(attendance.date.toString(), '');
        dateStr = dateStr.substr(dateStr.length - 2, 2);
        return employee.name + ', ' + dateStr;
    }
}
