import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FormControl } from '@angular/forms';
import { EmployeeService } from '../../../../services/modules/employee/employee.service';
import { DataStorage } from '../../../../classes/data-storage';
import { AssignTaskServiceAdapter } from './assign-task.service.adapter';
import { TeamService } from '../../../../services/modules/team/team.service';
import { InPagePermissionDialogComponent } from '@modules/employee/component/in-page-permission-dialog/in-page-permission-dialog.component';
import { TASK_PERMISSION_LIST } from '@modules/common/in-page-permission';

@Component({
    selector: 'assign-task',
    templateUrl: './assign-task.component.html',
    styleUrls: ['./assign-task.component.css'],
    providers: [MatDialog, TeamService, EmployeeService],
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
        public employeeService: EmployeeService,
        public teamService: TeamService) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AssignTaskServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getModuleById(id: number) {
        return this.moduleList.find(m => m.id == id);
    }

    hasPermission(employee: any, task: any) {
        return this.currentPermissionList.find((value) => {
            return value.parentEmployee === employee.id && value.parentTask === task.id;
        });
    }

    updatePermission(employee: any, task: any): void {
        this.updatePermissionLoading(employee, task, true);
        if (this.hasPermission(employee, task)) {
            this.serviceAdapter.deletePermission(employee, task);
        } else {
            this.serviceAdapter.addPermission(employee, task);
        }
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

    updatePermissionLoading(employee: any, task: any, permission: boolean): void {
        employee.permissionLoading = permission;
        task.permissionLoading = permission;
    }

    isPermissionLoading(employee: any, task: any): boolean {
        return employee.permissionLoading && task.permissionLoading;
    }

    openInPagePermissionDialog(module, task, employee) {
        const existingPermission = this.hasPermission(employee, task);
        const openedDialog = this.dialog.open(InPagePermissionDialogComponent, {
            data: {
                module, task, employee, existingPermission
            }
        });

        openedDialog.afterClosed().subscribe((data: any) => {
            if (data && data.employeePermissionConfigJson) {
                this.updatePermissionLoading(employee, task, true);
                if (existingPermission) {
                    this.serviceAdapter.updatePermission(
                        { ...existingPermission, configJSON: data.employeePermissionConfigJson },
                        employee, task);
                }
                else {
                    this.serviceAdapter.addPermission(employee, task, data.employeePermissionConfigJson);
                }
            }
        });
    }

    hasInPageTaskPermission(module, task): boolean {
        /*console.log(module.path);
        console.log(task.path);*/
        if (TASK_PERMISSION_LIST.find(taskPermission => taskPermission.modulePath == module.path && taskPermission.taskPath == task.path)) {
            console.log(module.path);
            console.log(task.path);
            return true;
        }
        return false;
    }
}
