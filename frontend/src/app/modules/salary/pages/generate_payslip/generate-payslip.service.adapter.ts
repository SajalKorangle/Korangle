import { GeneratePayslipComponent } from './generate-payslip.component';
import { ATTENDANCE_STATUS_LIST, LEAVE_OPTION_LIST, LEAVE_STATUS_LIST } from '../../../attendance/classes/constants';

export class GeneratePayslipServiceAdapter {
    vm: GeneratePayslipComponent;

    constructor() {}

    initializeAdapter(vm: GeneratePayslipComponent): void {
        this.vm = vm;
    }

    // Server Handling - 1
    public getEmployeeList(): void {
        let data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            isNonSalariedEmployee: false,
        };
        this.vm.isInitialLoading = true;
        this.vm.employeeService.getEmployeeMiniProfileList(data, this.vm.user.jwt).then(
            (employeeList) => {
                this.vm.employeeList = employeeList.filter((employee) => {
                    return employee.dateOfLeaving === null && employee.isNonSalariedEmployee===false;
                });
                this.vm.selectedEmployee = this.vm.employeeList[0];
                this.vm.isInitialLoading = false;
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    // Server Handling - 2
    public getInfoForSalary(): void {
        // Get the employee attendance status
        // Get the employee leave status
        // Get employee salary
        // Get employee payslip

        let request_attendance_data = {
            employeeIdList: [this.vm.selectedEmployee.id],
            startDate: this.vm.startDate,
            endDate: this.vm.endDate,
        };

        let request_leave_data = {
            employeeIdList: [this.vm.selectedEmployee.id],
            startDate: this.vm.startDate,
            endDate: this.vm.endDate,
        };

        let request_employee_profile = {
            id: this.vm.selectedEmployee.id,
        };

        let request_employee_payslip = {
            id: null,
            parentEmployee: this.vm.selectedEmployee.id,
            month: this.vm.selectedMonth,
            year: this.vm.selectedYear,
        };

        this.vm.isLoading = true;
        Promise.all([
            this.vm.attendanceService.getEmployeeAttendanceList(request_attendance_data, this.vm.user.jwt),
            this.vm.attendanceService.getEmployeeAppliedLeaveList(request_leave_data, this.vm.user.jwt),
            this.vm.employeeService.getEmployeeProfile(request_employee_profile, this.vm.user.jwt),
            this.vm.salaryService.getPayslip(request_employee_payslip, this.vm.user.jwt),
        ]).then(
            (value) => {
                this.prepareEmployeeDetails(value);
                this.vm.isLoading = false;
                this.vm.showEmployeeDetails = true;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    prepareEmployeeDetails(value: any): void {
        this.vm.employeeDetails = {};
        Object.keys(value[2]).forEach((key) => {
            this.vm.employeeDetails[key] = value[2][key];
        });
        let numberOfWorkingDays = 0;
        let numberOfUnpaidLeaves = 0;
        let numberofUnannouncedAbsents = 0;
        value[0].forEach((attendanceStatus) => {
            switch (attendanceStatus.status) {
                case ATTENDANCE_STATUS_LIST[0]:
                    numberOfWorkingDays += 1;
                    break;
                case ATTENDANCE_STATUS_LIST[1]:
                case ATTENDANCE_STATUS_LIST[3]:
                    numberOfWorkingDays += 1;
                    numberOfUnpaidLeaves += this.isUnpaidLeave(attendanceStatus, value[1]);
                    numberofUnannouncedAbsents += this.isUnannouncedAbsent(attendanceStatus, value[1]);
                    break;
            }
        });
        this.vm.employeeDetails['numberOfWorkingDays'] = numberOfWorkingDays;
        this.vm.employeeDetails['numberOfUnpaidLeaves'] = numberOfUnpaidLeaves;
        this.vm.employeeDetails['numberOfUnannouncedAbsents'] = numberofUnannouncedAbsents;
        this.vm.employeeDetails['payslip'] = value[3];
        if (this.vm.employeeDetails.monthlySalary) {
            this.vm.employeeDetails.estimatedSalary = Math.round(
                this.vm.employeeDetails.monthlySalary * (1 - (numberOfUnpaidLeaves + numberofUnannouncedAbsents) / 30)
            );
            this.vm.employeeDetails.amountDeductedPerUnpaidDay = Math.round(this.vm.employeeDetails.monthlySalary / 30);
        } else {
            this.vm.employeeDetails.estimatedSalary = 0;
            this.vm.employeeDetails.amountDeductedPerUnpaidDay = 0;
        }
        if (!this.vm.employeeDetails['payslip']) {
            this.vm.employeeDetails.payslip = {
                id: null,
                parentEmployee: this.vm.employeeDetails.id,
                amount: this.vm.employeeDetails.estimatedSalary,
                month: this.vm.selectedMonth,
                year: this.vm.selectedYear,
                remark: null,
            };
        }
        console.log(this.vm.employeeDetails);
    }

    isUnpaidLeave(attendanceStatus: any, leaveStatusList: any): any {
        let result = 0;
        leaveStatusList.every((leaveStatus) => {
            if (attendanceStatus.dateOfAttendance === leaveStatus.dateOfLeave) {
                /*if (leaveStatus.status !== LEAVE_STATUS_LIST[1] || !leaveStatus.paidLeave) {
                    if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                        result = 1;
                    } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[3]) {
                        result = 0.5;
                    }
                } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1] &&
                    leaveStatus.status.halfDay ){
                    result = 0.5;
                }*/
                if (leaveStatus.status == LEAVE_STATUS_LIST[1]) {
                    if (!leaveStatus.paidLeave) {
                        if (leaveStatus.halfDay) {
                            result = 0.5;
                        } else {
                            if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                                result = 1;
                            } else if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[3]) {
                                result = 0.5;
                            }
                        }
                    }
                }
                return false;
            }
            return true;
        });
        return result;
    }

    isUnannouncedAbsent(attendanceStatus: any, leaveStatusList: any): any {
        let result = 1;
        leaveStatusList.every((leaveStatus) => {
            if (attendanceStatus.dateOfAttendance === leaveStatus.dateOfLeave) {
                // if (leaveStatus.status === LEAVE_STATUS_LIST[1] || leaveStatus.paidLeave) {
                if (leaveStatus.status === LEAVE_STATUS_LIST[1]) {
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

    // Server Handling - 3
    generatePayslip(): void {
        if (this.vm.employeeDetails.payslip.amount === null || this.vm.employeeDetails.payslip.amount === '') {
            alert('amount can not be null');
            return;
        }
        this.vm.isLoading = true;
        this.vm.salaryService.createPayslip(this.vm.employeeDetails.payslip, this.vm.user.jwt).then(
            (value) => {
                alert(value.message);
                (this.vm.employeeDetails.payslip.id = value.id), (this.vm.isLoading = false);
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    deletePayslip(): void {
        this.vm.isLoading = true;
        this.vm.salaryService.deletePayslip(this.vm.employeeDetails.payslip, this.vm.user.jwt).then(
            (value) => {
                alert(value);
                this.vm.employeeDetails.payslip = {
                    id: null,
                    parentEmployee: this.vm.employeeDetails.id,
                    amount: this.vm.employeeDetails.estimatedSalary,
                    month: this.vm.selectedMonth,
                    year: this.vm.selectedYear,
                    remark: null,
                };
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
