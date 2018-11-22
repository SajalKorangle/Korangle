
import {CreateSchoolComponent} from './create-school.component';

export class CreateSchoolServiceAdapter {

    vm: CreateSchoolComponent;

    constructor() {}

    initializeAdapter(vm: CreateSchoolComponent): void {
        this.vm = vm;
    }

    // Server Handling - 1
    public getModuleList(): void {
        this.vm.isLoading = true;
        this.vm.teamService.getLatestModuleList(this.vm.user.jwt).then(moduleList => {
            this.vm.moduleList = moduleList;
            console.log(this.vm.moduleList);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    // Server Handling - 2
    public createSchool(data: any): void {
        // alert('Functionality yet to be implemented');
        console.log(data);
        if (!data.name || data.name == "" || data.name.length > 15) {
            alert('Name length should be b/w 1 to 15 characters');
            return;
        }
        if (!data.medium) {
            alert('Medium should be given');
            return;
        }
        if (!data.printName) {
            data.printName = "-";
        }
        if (!data.diseCode) {
            data.diseCode = "-";
        }
        if (!data.registrationNumber) {
            data.registrationNumber = "-";
        }
        if (!data.address) {
            data.address = "-";
        }
        data.mobileNumber = this.vm.user.username;
        data.primaryThemeColor = "green";
        data.secondaryThemeColor = "warning";
        data.complexFeeStructure = false;
        data.currentSession = 2;
        data.smsId = "KORNGL";
        if (data.printName && data.printName.length > 15) {
            data.headerSize = "BIG";
        } else {
            data.headerSize = "SMALL";
        }
        this.vm.isLoading = true;
        this.vm.schoolService.createSchoolProfile(data,this.vm.user.jwt).then(value => {
            console.log(value.message);
            let request_access_data = this.prepareSchoolAccessData(value.id);
            let request_employee_data = this.prepareSchoolEmployeeData(value.id);
            Promise.all([
                this.vm.teamService.create_school_access_batch(request_access_data, this.vm.user.jwt),
                this.vm.employeeService.createEmployeeProfile(request_employee_data, this.vm.user.jwt),
                this.vm.teamService.get_task_list(this.vm.user.jwt),
            ]).then(value => {
                console.log(value);
                let request_employee_permission_data = this.prepareEmployeePermissionData(value[1].id, value[2]);
                this.vm.employeeService.addEmployeePermissionList(request_employee_permission_data, this.vm.user.jwt).then(value => {
                    alert('School created successfully, Logout and login again to see changes');
                    this.vm.isLoading = false;
                }, error => {
                    this.vm.isLoading = false;
                });
            });
        });
    }

    prepareSchoolAccessData(schoolDbId: number): any {
        let data_list = [];
        this.vm.moduleList.forEach(module => {
            let tempData = {
                parentModule: module.id,
                parentSchool: schoolDbId,
            };
            data_list.push(tempData);
        });
        return data_list;
    }

    prepareSchoolEmployeeData(schoolDbId: number): any {
        let employee = {
            name: this.vm.user.first_name+" "+this.vm.user.last_name,
            fatherName: "-",
            mobileNumber: this.vm.user.username,
            parentSchool: schoolDbId,
            dateOfBirth: null,
            dateOfJoining: null,
            dateOfLeaving: null,
        };
        return employee;
    }

    prepareEmployeePermissionData(employeeId: number, taskList: any): any {
        let data_list = [];
        taskList.forEach(task => {
            let tempData = {
                parentEmployee: employeeId,
                parentTask: task.id,
            };
            data_list.push(tempData);
        });
        return data_list;
    }

    // Server Handling - 1
    /*public getEmployeeLeaveDetails(): void {

        let request_employee_mini_profile_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_employee_session_details_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.employeeService.getEmployeeMiniProfileList(request_employee_mini_profile_data, this.vm.user.jwt),
            this.vm.employeeService.getEmployeeSessionDetailList(request_employee_session_details_data, this.vm.user.jwt),
        ]).then(value => {
            this.vm.employeeMiniProfileList = value[0].filter(employee => {
                return employee.dateOfLeaving===null;
            });
            this.vm.employeeSessionList = value[1];
            let data = {
                employeeIdList: this.getEmployeeIdList(),
                startDate: this.vm.selectedSession.startDate,
                endDate: this.vm.selectedSession.endDate,
            };
            this.vm.attenendanceService.getEmployeeAppliedLeaveList(data, this.vm.user.jwt).then(employeeAppliedLeaveList => {
                console.log(employeeAppliedLeaveList);
                this.prepareEmployeeLeaveDetails(employeeAppliedLeaveList);
                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            });
        }, error => {
            this.vm.isLoading = false;
        })
    }

    getEmployeeIdList(): any {
        let result = [];
        this.vm.employeeMiniProfileList.forEach(employee => {
            result.push(employee.id);
        });
        return result;
    }

    prepareEmployeeLeaveDetails(employeeAppliedLeaveList: any): void {
        this.vm.employeeList = [];
        this.vm.employeeMiniProfileList.forEach(employee => {
            let tempEmployee = {
                id: employee.id,
                name: employee.name,
                employeeNumber: employee.employeeNumber,
                paidLeaveNumber: 0,
                isLoading: false,
            };
            this.vm.employeeSessionList.every(employeeSession => {
                if (employeeSession.parentEmployee === employee.id) {
                    tempEmployee['paidLeaveNumber'] = employeeSession.paidLeaveNumber;
                }
            });
            tempEmployee['originalAppliedLeaveList'] = [];
            tempEmployee['modifiedAppliedLeaveList'] = [];
            employeeAppliedLeaveList.forEach(employeeAppliedLeave => {
                if(employeeAppliedLeave.parentEmployee === employee.id) {

                    let tempOne = {};
                    let tempTwo = {};

                    Object.keys(employeeAppliedLeave).forEach(key => {
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
        ]).then(value => {
            this.vm.employeeSessionList = value[0];
            this.prepareEmployeeLeaveDetails(value[1]);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    // Server Handling - 3
    submitAppliedLeave(employee: any): void {
        let appliedLeaveList = [];
        employee.modifiedAppliedLeaveList.forEach((appliedLeave, index) => {
            if (employee.originalAppliedLeaveList[index].status !== appliedLeave.status ||
                employee.originalAppliedLeaveList[index].paidLeave !== appliedLeave.paidLeave) {
                appliedLeaveList.push(appliedLeave);
            }
        });

        if (appliedLeaveList.length === 0) {
            alert('Nothing to update');
            return;
        }

        employee.isLoading = true;
        this.vm.attenendanceService.updateEmployeeAppliedLeaveList(appliedLeaveList, this.vm.user.jwt).then(response => {
            alert(response);
            this.updateOriginalList(employee, appliedLeaveList);
            employee.isLoading = false;
        }, error => {
            employee.isLoading = false;
        });


    }

    updateOriginalList(employee: any, leaveList: any): void {
        employee.originalAppliedLeaveList.forEach(appliedLeave => {
            leaveList.forEach(leave => {
                if (appliedLeave.id === leave.id) {
                    Object.keys(leave).forEach(key => {
                        appliedLeave[key] = leave[key];
                    });
                }
            });
        });
    }*/

}