import {Component, Input, OnInit } from '@angular/core';

import {FormControl} from '@angular/forms';
import {EmployeeService} from '../../employee.service';
import {TeamService} from '../../../team/team.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css'],
    providers: [ EmployeeService, TeamService ],
})

export class AssignTaskComponent implements OnInit {

    user;

    moduleList = [];

    myControl = new FormControl();

    selectedEmployee: any;

    isLoading = false;

    constructor ( private employeeService: EmployeeService,
                  private teamService: TeamService) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        console.log(this.user.username);

        const request_module_data = {
            schoolDbId: this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        Promise.all([
            this.teamService.getSchoolModuleList(request_module_data, this.user.jwt),
        ]).then(value => {
            console.log(value);
            this.isLoading = false;
            this.initializeModuleList(value[0]);
        }, error => {
            this.isLoading = false;
        });

    }

    initializeModuleList(moduleList: any): void {
        this.moduleList = moduleList;
        this.moduleList.forEach(module => {
            module.taskList.forEach(task => {
                task.selected = false;
            })
        })
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
                    if (employeePermission.parentTask === task.dbId) {
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
            'parentTask': task.dbId,
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
