import { PrintSalarySheetComponent } from './print-salary-sheet.component';
import { ATTENDANCE_STATUS_LIST, LEAVE_OPTION_LIST, LEAVE_STATUS_LIST } from '../../../attendance/classes/constants';

export class PrintSalarySheetServiceAdapter {
    vm: PrintSalarySheetComponent;

    constructor() {}

    initializeAdapter(vm: PrintSalarySheetComponent): void {
        this.vm = vm;
    }

    // Server Handling - 1
    public getEmployeeList(): void {
        let data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            isNonSalariedEmployee: false,
        };
        this.vm.employeeService.getEmployeeProfileList(data, this.vm.user.jwt).then(
            (employeeList) => {
                this.vm.employeeList = employeeList;
                if (this.vm.selectedMonth) {
                    this.getInfoForSalary();
                }
            },
            (error) => {}
        );
    }

    // Server Handling - 2
    public getInfoForSalary(): void {
        let request_attendance_data = {
            employeeIdList: this.getEmployeeIdList().join(),
            startDate: this.vm.startDate,
            endDate: this.vm.endDate,
        };

        let request_leave_data = {
            employeeIdList: this.getEmployeeIdList().join(),
            startDate: this.vm.startDate,
            endDate: this.vm.endDate,
        };

        let request_monthly_payslip = {
            employeeList: this.getEmployeeIdList().join(),
            monthList: this.vm.selectedMonth,
            yearList: this.vm.selectedYear,
        };

        this.vm.isLoading = true;
        Promise.all([
            this.vm.attendanceService.getEmployeeAttendanceList(request_attendance_data, this.vm.user.jwt),
            this.vm.attendanceService.getEmployeeAppliedLeaveList(request_leave_data, this.vm.user.jwt),
            this.vm.salaryService.getPayslipList(request_monthly_payslip, this.vm.user.jwt),
        ]).then(
            (value) => {
                this.prepareEmployeeData(value);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getEmployeeIdList(): any {
        let id_list = [];
        this.vm.employeeList.forEach((item) => {
            id_list.push(item.id);
        });
        return id_list;
    }

    prepareEmployeeData(value: any): void {
        this.vm.employeeList.forEach((employee) => {
            employee['netSalary'] = null;
            value[2].every((item) => {
                if (employee.id === item.parentEmployee) {
                    employee['netSalary'] = item.amount;
                    return false;
                }
                return true;
            });
            if (employee['netSalary'] !== null) {
                let numberOfWorkingDays = 0;
                let numberOfUnpaidLeaves = 0;
                let numberofUnannouncedAbsents = 0;
                value[0]
                    .filter((item) => {
                        return item.parentEmployee === employee.id;
                    })
                    .forEach((attendanceStatus) => {
                        switch (attendanceStatus.status) {
                            case ATTENDANCE_STATUS_LIST[0]:
                                numberOfWorkingDays += 1;
                                break;
                            case ATTENDANCE_STATUS_LIST[1]:
                            case ATTENDANCE_STATUS_LIST[3]:
                                numberOfWorkingDays += 1;
                                numberOfUnpaidLeaves += this.isUnpaidLeave(attendanceStatus, value[1], employee);
                                numberofUnannouncedAbsents += this.isUnannouncedAbsent(attendanceStatus, value[1], employee);
                                break;
                        }
                    });
                employee['numberOfUnpaidLeaves'] = numberOfUnpaidLeaves;
                employee['numberOfUnannouncedAbsents'] = numberofUnannouncedAbsents;
                employee['numberOfWorkingDays'] = 30 - numberOfUnpaidLeaves - numberofUnannouncedAbsents;
            }
        });
    }

    isUnpaidLeave(attendanceStatus: any, leaveStatusList: any, employee: any): any {
        let result = 0;
        leaveStatusList
            .filter((item) => {
                return item.parentEmployee === employee.id;
            })
            .every((leaveStatus) => {
                if (attendanceStatus.dateOfAttendance === leaveStatus.dateOfLeave) {
                    if (leaveStatus.status !== LEAVE_STATUS_LIST[1] || !leaveStatus.paidLeave) {
                        if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                            result = 1;
                        } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[3]) {
                            result = 0.5;
                        }
                    } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1] && leaveStatus.status.halfDay) {
                        result = 0.5;
                    }
                    return false;
                }
                return true;
            });
        return result;
    }

    isUnannouncedAbsent(attendanceStatus: any, leaveStatusList: any, employee: any): any {
        let result = 1;
        leaveStatusList
            .filter((item) => {
                return item.parentEmployee === employee.id;
            })
            .every((leaveStatus) => {
                if (attendanceStatus.dateOfAttendance === leaveStatus.dateOfLeave) {
                    if (leaveStatus.status === LEAVE_STATUS_LIST[1] || leaveStatus.paidLeave) {
                        if (leaveStatus.halfDay && attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                            result = 0.5;
                        } else {
                            result = 0;
                        }
                    }
                    return false;
                }
                return true;
            });
        return result;
    }
}
