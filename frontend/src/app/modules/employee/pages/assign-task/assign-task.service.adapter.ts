import { AssignTaskComponent } from './assign-task.component';

export class AssignTaskServiceAdapter {
    vm: AssignTaskComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: AssignTaskComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        let module_data = {
            parentBoard__or: this.vm.user.activeSchool.parentBoard,
            parentBoard: 'null__korangle',
        };

        let task_data = {
            parentBoard__or: this.vm.user.activeSchool.parentBoard,
            parentBoard: 'null__korangle',
            parentModule__parentBoard__or: this.vm.user.activeSchool.parentBoard,
            parentModule__parentBoard: 'null__korangle',
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.teamService.getObjectList(this.vm.teamService.module, module_data),
            this.vm.teamService.getObjectList(this.vm.teamService.task, task_data),
        ]).then(
            (value) => {
                this.initializeModuleList(value[0], value[1]);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getPermissionList(): void {
        const data = {};
        if (this.vm.selectedAssignTaskOption === this.vm.assignTaskOptions[0]) {
            data['parentEmployee'] = this.vm.selectedEmployee.id;
        } else {
            data['parentTask'] = this.vm.selectedTask.id;
        }
        this.vm.isLoading = true;
        Promise.all([this.vm.employeeService.getObjectList(this.vm.employeeService.employee_permissions, data)]).then(
            (value) => {
                this.vm.currentPermissionList = value[0];
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    initializeModuleList(moduleList: any, taskList: any): void {
        this.vm.moduleList = moduleList;
        this.vm.moduleList.forEach((module) => {
            module.taskList = taskList
                .filter((task) => {
                    task.selected = false;
                    return task.parentModule == module.id;
                })
                .sort((a, b) => {
                    return a.orderNumber - b.orderNumber;
                });
        });
        this.vm.moduleList = this.vm.moduleList.sort((a, b) => {
            return a.orderNumber - b.orderNumber;
        });
    }

    async addPermission(employee: any, task: any, configJSON: any = {}) {
        const newEmployeePermission = {
            parentEmployee: employee.id,
            parentTask: task.id,
            configJSON: JSON.parse(configJSON),
        };

        const respone = await this.vm.employeeService.createObject(this.vm.employeeService.employee_permissions, newEmployeePermission);
        this.vm.currentPermissionList.push(respone);
        this.vm.updatePermissionLoading(employee, task, false);
    }

    async updatePermission(employeePermission, employee, task) {
        const respone = await this.vm.employeeService.updateObject(this.vm.employeeService.employee_permissions, employeePermission);
        const prevEmployeePermission = this.vm.hasPermission(employee, task);
        Object.assign(prevEmployeePermission, respone);
        this.vm.updatePermissionLoading(employee, task, false);
    }

    async deletePermission(employee: any, task: any) {
        const perm_id = this.vm.hasPermission(employee, task);
        const data = {
            id: perm_id,
        };
        await this.vm.employeeService.deleteObject(this.vm.employeeService.employee_permissions, data);
        this.vm.updatePermissionLoading(employee, task, false);
    }

    async assignAllTasks(employee) {
        const toCreatePermissions = [];

        this.vm.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                if (!this.vm.hasPermission(employee, task)) {
                    this.vm.updatePermissionLoading(employee, task, true);
                    toCreatePermissions.push(
                        {
                            parentEmployee: employee.id,
                            parentTask: task.id,
                        }
                    );
                }
            });
        });

        const response = await this.vm.employeeService.createObjectList(this.vm.employeeService.employee_permissions, toCreatePermissions);
        this.vm.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                if (!this.vm.hasPermission(employee, task)) {
                    this.vm.updatePermissionLoading(employee, task, false);
                }
            });
        });
        this.vm.currentPermissionList.push(...response);

    }

    async removeAllPermissions(employee: any) {
        const toDeletePermissions = [];
        this.vm.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                const existingEmployeePermission = this.vm.hasPermission(employee, task);
                if (existingEmployeePermission && !this.vm.isDisabled(module, task, employee)) {
                    this.vm.updatePermissionLoading(employee, task, true);
                    toDeletePermissions.push({ id: existingEmployeePermission.id });
                }
            });
        });

        const response = await this.vm.employeeService.deleteObjectList(this.vm.employeeService.employee_permissions, toDeletePermissions);
        this.vm.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                const existingEmployeePermission = this.vm.hasPermission(employee, task);
                if (existingEmployeePermission && !this.vm.isDisabled(module, task, employee)) {
                    this.vm.updatePermissionLoading(employee, task, false);
                }
            });
        });
        response.forEach(res => {
            this.vm.currentPermissionList = this.vm.currentPermissionList.filter(employeePermission => employeePermission.id != res.id);
        });
    }
}
