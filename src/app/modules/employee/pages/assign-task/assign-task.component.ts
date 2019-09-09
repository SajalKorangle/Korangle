import {Component, Input, OnInit } from '@angular/core';

import {FormControl} from '@angular/forms';
import {EmployeeOldService} from '../../../../services/modules/employee/employee-old.service';
import {DataStorage} from "../../../../classes/data-storage";
import {AssignTaskServiceAdapter} from "./assign-task.service.adapter";
import {TeamService} from "../../../../services/modules/team/team.service";

@Component({
  selector: 'assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css'],
    providers: [ EmployeeOldService, TeamService ],
})

export class AssignTaskComponent implements OnInit {

    user;

    moduleList = [];

    myControl = new FormControl();

    selectedEmployee: any;

    serviceAdapter: AssignTaskServiceAdapter;

    isLoading = false;

    constructor (public employeeService: EmployeeOldService,
                 public teamService: TeamService) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AssignTaskServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

    }

    getEmployeePermissionList(employee: any): void {
        let data = {
            parentEmployee: employee.id,
        };
        this.isLoading = true;
        this.selectedEmployee = employee;
        this.employeeService.getEmployeePermissionList(data, this.user.jwt).then( employeePermissionList => {
            this.isLoading = false;
            this.initializeModulePermissions(employeePermissionList);
        }, error => {
            this.isLoading = false;
        });
    }

    initializeModulePermissions(employeePermissionList: any): void {
        this.moduleList.forEach(module => {
            module.taskList.forEach(task => {
                task.employeePermissionId = null;
                task.permissionLoading = false;
                employeePermissionList.forEach(employeePermission => {
                    if (employeePermission.parentTask === task.id) {
                        task.employeePermissionId = employeePermission.id;
                    }
                });
            });
        });
    }

    updateEmployeePermission(task: any): void {
        task.permissionLoading = true;
        if (task.employeePermissionId !== null) {
            this.deleteEmployeePermission(task);
        } else {
            this.addEmployeePermission(task);
        }
    }

    addEmployeePermission(task: any): void {
        let data = {
            'parentEmployee': this.selectedEmployee.id,
            'parentTask': task.id,
        };
        this.employeeService.addEmployeePermission(data, this.user.jwt).then(response => {
            if (response.status === 'success') {
                task.employeePermissionId = response.id;
            }
            task.permissionLoading = false;
        }, error => {
            alert('Not able to add employee permission');
            task.permissionLoading = false;
        });
    }

    deleteEmployeePermission(task: any): void {
        let data = {
            'id': task.employeePermissionId,
        };
        this.employeeService.deleteEmployeePermission(data, this.user.jwt).then(response => {
            task.employeePermissionId = null;
            task.permissionLoading = false;
        }, error => {
            alert('Not able to remove employee permission');
            task.permissionLoading = false;
        });
    }

    isDisabled(module: any, task: any): boolean {
        return task.permissionLoading
            || (parseInt(this.user.username) === this.selectedEmployee.mobileNumber
                && module.path === 'employees'
                && task.path === 'assign_task');
    }

}
