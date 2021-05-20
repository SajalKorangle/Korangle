import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FormControl } from '@angular/forms';
import { EmployeeOldService } from '../../../../services/modules/employee/employee-old.service';
import { EmployeeService } from '../../../../services/modules/employee/employee.service';
import { DataStorage } from '../../../../classes/data-storage';
import { AssignTaskServiceAdapter } from './assign-task.service.adapter';
import { TeamService } from '../../../../services/modules/team/team.service';
import { InPagePermissionDialogComponent } from '@modules/employee/component/in-page-permission-dialog/in-page-permission-dialog.component';
import { TASK_PERMISSION_LIST } from '@classes/task-settings';

@Component({
    selector: 'assign-task',
    templateUrl: './assign-task.component.html',
    styleUrls: ['./assign-task.component.css'],
    providers: [MatDialog, EmployeeOldService, TeamService, EmployeeService],
})
export class AssignTaskComponent implements OnInit {
    user;
    moduleList = [];
    selectedModule: any;
    selectedTask: any;
    assignTaskOptions = ['By Employee', 'By Task'];
    currentPermissionList: any;
    selectedAssignTaskOption = this.assignTaskOptions[0];
    myControl = new FormControl();
    employeeList = [];
    selectedEmployee: any;
    serviceAdapter: AssignTaskServiceAdapter;
    isLoading = false;

    constructor(
        public dialog: MatDialog,
        public employeeOldService: EmployeeOldService,
        public employeeService: EmployeeService,
        public teamService: TeamService) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AssignTaskServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    hasPermission(employee: any, task: any) {
        const obj = this.currentPermissionList.find((value) => {
            return value.parentEmployee === employee.id && value.parentTask === task.id;
        });
        if (obj === undefined) {
            return false;
        } else {
            return obj.id;
        }
    }

    updatePermission(employee: any, task: any): void {
        this.updatePermissionLoading(employee, task, true);
        if (this.hasPermission(employee, task)) {
            this.deletePermission(employee, task);
        } else {
            this.addPermission(employee, task);
        }
    }

    deletePermission(employee: any, task: any): void {
        const perm_id = this.hasPermission(employee, task);
        const data = {
            id: perm_id,
        };
        this.employeeOldService.deleteEmployeePermission(data, this.user.jwt).then(
            (response) => {
                this.currentPermissionList = this.currentPermissionList.filter((value) => value.id !== perm_id);
                this.updatePermissionLoading(employee, task, false);
            },
            (error) => {
                alert('Not able to remove employee permission');
                this.updatePermissionLoading(employee, task, false);
            }
        );
    }

    addPermission(employee: any, task: any): void {
        const data = {
            parentEmployee: employee.id,
            parentTask: task.id,
        };
        this.employeeOldService.addEmployeePermission(data, this.user.jwt).then(
            (response) => {
                if (response.status === 'success') {
                    this.currentPermissionList.push({
                        id: response.id,
                        parentEmployee: employee.id,
                        parentTask: task.id,
                    });
                }
                this.updatePermissionLoading(employee, task, false);
            },
            (error) => {
                alert('Not able to add employee permission');
                this.updatePermissionLoading(employee, task, false);
            }
        );
    }

    isDisabled(module: any, task: any, employee: any): boolean {
        return (
            this.isPermissionLoading(employee, task) ||
            (parseInt(this.user.username) === employee.mobileNumber && module.path === 'employees' && task.path === 'assign_task')
        );
    }

    changeFilterVal(assignTaskOption: any): void {
        this.selectedAssignTaskOption = assignTaskOption;
        this.selectedEmployee = null;
        this.selectedModule = null;
        this.selectedTask = null;
    }

    assignAllTasks(employee: any): void {
        this.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                if (!this.hasPermission(employee, task)) {
                    this.updatePermissionLoading(employee, task, true);
                    this.addPermission(employee, task);
                }
            });
        });
    }

    removeAllPermissions(employee: any): void {
        this.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                if (this.hasPermission(employee, task) && !this.isDisabled(module, task, employee)) {
                    this.updatePermissionLoading(employee, task, true);
                    this.deletePermission(employee, task);
                }
            });
        });
    }

    updatePermissionLoading(employee: any, task: any, permission: boolean): void {
        employee.permissionLoading = permission;
        task.permissionLoading = permission;
    }

    isPermissionLoading(employee: any, task: any): boolean {
        return employee.permissionLoading && task.permissionLoading;
    }

    openInPagePermissionDialog(module, task) {
        this.dialog.open(InPagePermissionDialogComponent, {
            data: {
                module,
                task,
            }
        });
    }

    hasInPageTaskPermission(module, task): boolean {
        if (TASK_PERMISSION_LIST.find(taskPermission => taskPermission.modulePath == module.path && taskPermission.taskPath == task.path))
            return true;
        return false;
    }
}
