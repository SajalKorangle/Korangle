import { ApproveLeaveComponent } from './approve-leave.component';

export class ApproveLeaveServiceAdapter {
    vm: ApproveLeaveComponent;

    constructor() {}

    initializeAdapter(vm: ApproveLeaveComponent): void {
        this.vm = vm;
    }

    initializeData() {
        this.vm.isLoading = true;
        this.vm.genericService.getObjectList({school_app: 'Session'}, {}).then((session) => {
            this.vm.sessionList = session;
            this.vm.selectedSession = this.vm.sessionList.find((item) => item.id == this.vm.user.activeSchool.currentSessionDbId);
            this.vm.serviceAdapter.getEmployeeLeaveDetails();
        });
    }

    // Server Handling - 1
    public getEmployeeLeaveDetails(): void {
        let request_employee_mini_profile_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_employee_session_details_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.employeeService.getEmployeeMiniProfileList(request_employee_mini_profile_data, this.vm.user.jwt),
            this.vm.employeeService.getEmployeeSessionDetailList(request_employee_session_details_data, this.vm.user.jwt),
        ]).then(
            (value) => {
                this.vm.employeeMiniProfileList = value[0].filter((employee) => {
                    return employee.dateOfLeaving === null;
                });
                this.vm.employeeSessionList = value[1];
                let data = {
                    employeeIdList: this.getEmployeeIdList(),
                    startDate: this.vm.selectedSession.startDate,
                    endDate: this.vm.selectedSession.endDate,
                };
                this.vm.attenendanceService.getEmployeeAppliedLeaveList(data, this.vm.user.jwt).then(
                    (employeeAppliedLeaveList) => {
                        this.prepareEmployeeLeaveDetails(employeeAppliedLeaveList);
                        this.vm.isLoading = false;
                    },
                    (error) => {
                        this.vm.isLoading = false;
                    }
                );
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getEmployeeIdList(): any {
        let result = [];
        this.vm.employeeMiniProfileList.forEach((employee) => {
            result.push(employee.id);
        });
        return result;
    }

    prepareEmployeeLeaveDetails(employeeAppliedLeaveList: any): void {
        this.vm.employeeList = [];
        this.vm.employeeMiniProfileList.forEach((employee) => {
            let tempEmployee = {
                id: employee.id,
                name: employee.name,
                employeeNumber: employee.employeeNumber,
                paidLeaveNumber: 0,
                isLoading: false,
            };
            this.vm.employeeSessionList.every((employeeSession) => {
                if (employeeSession.parentEmployee === employee.id) {
                    tempEmployee['paidLeaveNumber'] = employeeSession.paidLeaveNumber;
                }
            });
            tempEmployee['originalAppliedLeaveList'] = [];
            tempEmployee['modifiedAppliedLeaveList'] = [];
            employeeAppliedLeaveList.forEach((employeeAppliedLeave) => {
                if (employeeAppliedLeave.parentEmployee === employee.id) {
                    let tempOne = {};
                    let tempTwo = {};

                    Object.keys(employeeAppliedLeave).forEach((key) => {
                        tempOne[key] = employeeAppliedLeave[key];
                        tempTwo[key] = employeeAppliedLeave[key];
                    });

                    tempEmployee['originalAppliedLeaveList'].push(tempOne);
                    tempEmployee['modifiedAppliedLeaveList'].push(tempTwo);
                }
            });
            this.vm.employeeList.push(tempEmployee);
        });
    }

    // Server Handling - 2
    getEmployeeAppliedLeaveList(): void {
        let request_employee_session_details_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
        };

        let data = {
            employeeIdList: this.getEmployeeIdList(),
            startDate: this.vm.selectedSession.startDate,
            endDate: this.vm.selectedSession.endDate,
        };
        this.vm.isLoading = true;
        Promise.all([
            this.vm.employeeService.getEmployeeSessionDetailList(request_employee_session_details_data, this.vm.user.jwt),
            this.vm.attenendanceService.getEmployeeAppliedLeaveList(data, this.vm.user.jwt),
        ]).then(
            (value) => {
                this.vm.employeeSessionList = value[0];
                this.prepareEmployeeLeaveDetails(value[1]);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    // Server Handling - 3
    submitAppliedLeave(employee: any): void {
        let appliedLeaveList = [];
        employee.modifiedAppliedLeaveList.forEach((appliedLeave, index) => {
            if (
                employee.originalAppliedLeaveList[index].status !== appliedLeave.status ||
                employee.originalAppliedLeaveList[index].paidLeave !== appliedLeave.paidLeave
            ) {
                appliedLeaveList.push(appliedLeave);
            }
        });

        if (appliedLeaveList.length === 0) {
            alert('Nothing to update');
            return;
        }

        employee.isLoading = true;
        this.vm.attenendanceService.updateEmployeeAppliedLeaveList(appliedLeaveList, this.vm.user.jwt).then(
            (response) => {
                alert(response);
                this.updateOriginalList(employee, appliedLeaveList);
                employee.isLoading = false;
            },
            (error) => {
                employee.isLoading = false;
            }
        );
    }

    updateOriginalList(employee: any, leaveList: any): void {
        employee.originalAppliedLeaveList.forEach((appliedLeave) => {
            leaveList.forEach((leave) => {
                if (appliedLeave.id === leave.id) {
                    Object.keys(leave).forEach((key) => {
                        appliedLeave[key] = leave[key];
                    });
                }
            });
        });
    }
}
