import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { DataStorage } from '../../../../classes/data-storage';
import { TeamService } from '../../../../services/modules/team/team.service';
import { EmployeeService } from '../../../../services/modules/employee/employee.service';
import { BankService } from '../../../../services/bank.service';

import { InPagePermissionDialogComponent } from '@modules/employee/component/in-page-permission-dialog/in-page-permission-dialog.component';
import { TASK_PERMISSION_LIST } from '@classes/task-settings';

@Component({
    selector: 'add-employee',
    templateUrl: './add-employee.component.html',
    styleUrls: ['./add-employee.component.css'],
    providers: [MatDialog, BankService, TeamService, EmployeeService, EmployeeOldService],
})
export class AddEmployeeComponent implements OnInit {
    user;

    newEmployee: any;
    newEmployeeSessionDetail: any;

    employeeList = [];
    moduleList = [];

    isLoading = false;

    constructor(
        public dialog: MatDialog,
        private employeeOldService: EmployeeOldService,
        private employeeService: EmployeeService,
        private bankService: BankService,
        private teamService: TeamService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.isLoading = true;
        this.newEmployee = {};
        this.newEmployeeSessionDetail = {};
        let data = {
            parentSchool: this.user.activeSchool.dbId,
        };
        this.employeeOldService.getEmployeeMiniProfileList(data, this.user.jwt).then((employeeList) => {
            this.employeeList = employeeList;
        });

        let module_data = {
            parentBoard__or: this.user.activeSchool.parentBoard,
            parentBoard: 'null__korangle',
        };

        let task_data = {
            parentBoard__or: this.user.activeSchool.parentBoard,
            parentBoard: 'null__korangle',
            parentModule__parentBoard__or: this.user.activeSchool.parentBoard,
            parentModule__parentBoard: 'null__korangle',
        };

        Promise.all([
            this.employeeOldService.getEmployeeMiniProfileList(data, this.user.jwt),
            this.teamService.getObjectList(this.teamService.module, module_data),
            this.teamService.getObjectList(this.teamService.task, task_data),
        ]).then(
            (value) => {
                console.log(value[0]);
                this.employeeList = value[0];
                this.initializeModuleList(value[1], value[2]);
                this.isLoading = false;
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    isSelected(task: any) {
        if (task.selected) {
            return task.id;
        }
    }

    grantAll() {
        this.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                task.selected = true;
            });
        });
    }

    removeAll() {
        this.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                task.selected = false;
                task.configJSON = null;
            });
        });
    }

    initializeModuleList(moduleList: any, taskList: any): void {
        this.moduleList = moduleList;
        this.moduleList.forEach((module) => {
            module.taskList = taskList
                .filter((task) => {
                    task.selected = false;
                    return task.parentModule == module.id;
                })
                .sort((a, b) => {
                    return a.orderNumber - b.orderNumber;
                });
        });
        this.moduleList = this.moduleList.sort((a, b) => {
            return a.orderNumber - b.orderNumber;
        });
        console.log(this.moduleList);
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

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (
            value !== '0' &&
            value !== '1' &&
            value !== '2' &&
            value !== '3' &&
            value !== '4' &&
            value !== '5' &&
            value !== '6' &&
            value !== '7' &&
            value !== '8' &&
            value !== '9'
        ) {
            return false;
        }
        return true;
    }

    getBankDetails() {
        if (this.newEmployee.bankIfscCode.length < 11) {
            return;
        }
        this.bankService.getDetailsFromIFSCCode(this.newEmployee.bankIfscCode.toString()).then((value) => {
            this.newEmployee.bankName = value;
        });
    }

    createNewEmployee(): void {
        console.log('CREATE NEW EMPLOYEE CALLED');

        if (this.newEmployee.name === undefined || this.newEmployee.name === '') {
            alert('Name should be populated');
            return;
        }

        if (this.newEmployee.fatherName === undefined || this.newEmployee.fatherName === '') {
            alert("Father's Name should be populated");
            return;
        }

        if (this.newEmployee.dateOfBirth === undefined || this.newEmployee.dateOfBirth === '') {
            this.newEmployee.dateOfBirth = null;
        }

        if (this.newEmployee.dateOfJoining === undefined || this.newEmployee.dateOfJoining === '') {
            this.newEmployee.dateOfJoining = null;
        }

        if (this.newEmployee.dateOfLeaving === undefined || this.newEmployee.dateOfLeaving === '') {
            this.newEmployee.dateOfLeaving = null;
        }

        if (this.newEmployee.mobileNumber === undefined || this.newEmployee.mobileNumber === null) {
            this.newEmployee.mobileNumber = null;
            alert('Mobile number is required');
            return;
        } else if (this.newEmployee.mobileNumber.toString().length != 10) {
            alert('Mobile number should be of 10 digits');
            return;
        } else {
            let selectedEmployee = null;
            this.employeeList.forEach((employee) => {
                if (employee.mobileNumber === this.newEmployee.mobileNumber) {
                    selectedEmployee = employee;
                }
            });
            if (selectedEmployee) {
                alert('Mobile Number already exists in ' + selectedEmployee.name + "'s profile");
                return;
            }
        }

        if (this.newEmployee.aadharNumber != null && this.newEmployee.aadharNumber.toString().length != 12) {
            alert('Aadhar No. should be 12 digits');
            return;
        }

        this.newEmployee.parentSchool = this.user.activeSchool.dbId;

        this.isLoading = true;

        console.log(this.newEmployee);
        this.employeeOldService.createEmployeeProfile(this.newEmployee, this.user.jwt).then(
            (response) => {
                let post_data = {
                    parentEmployee: response.id,
                    parentSession: this.user.activeSchool.currentSessionDbId,
                    paidLeaveNumber: this.newEmployeeSessionDetail.paidLeaveNumber,
                };
                this.employeeOldService.createEmployeeSessionDetail(post_data, this.user.jwt).then((res) => {
                    console.log(response);
                    let data = [];
                    this.moduleList.forEach((module) => {
                        module.taskList.forEach((task) => {
                            if (task.selected) {
                                data.push({
                                    parentEmployee: response.id,
                                    parentTask: task.id,
                                });
                                if (task.configJSON) {
                                    data[data.length - 1].configJSON = task.configJSON;
                                }
                            }
                        });
                    });
                    this.employeeService.createObjectList(this.employeeService.employee_permissions, data).then((value) => {
                        this.moduleList.forEach((module) => {
                            module.taskList.forEach((task) => {
                                task.selected = false;
                            });
                        });
                        this.isLoading = false;
                        alert('Employee Profile Created Successfully');
                        this.newEmployee = {};
                        this.newEmployeeSessionDetail = {};
                    });
                });
            },
            (error) => {
                this.isLoading = false;
                alert('Server Error: Contact admin');
            }
        );
    }

    hasInPageTaskPermission(module, task): boolean {
        if (TASK_PERMISSION_LIST.find(taskPermission => taskPermission.modulePath == module.path && taskPermission.taskPath == task.path))
            return true;
        return false;
    }

    openInPagePermissionDialog(module, task, employee) {
        const openedDialog = this.dialog.open(InPagePermissionDialogComponent, {
            data: {
                module, task, employee: { name: "New Employee" },
            }
        });

        openedDialog.afterClosed().subscribe((data: any) => {
            if (data && data.employeePermissionConfigJson) {
                task.configJSON = data.employeePermissionConfigJson;
                task.selected = true;
            }
        });
    }
}
