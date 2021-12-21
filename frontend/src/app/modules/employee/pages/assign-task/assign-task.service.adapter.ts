import { Query } from '@services/generic/query';
import { AssignTaskComponent } from './assign-task.component';
import { TASK_PERMISSION_LIST, InPagePermission } from '@modules/common/in-page-permission';

export class AssignTaskServiceAdapter {
    vm: AssignTaskComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: AssignTaskComponent): void {
        this.vm = vm;
    }

    // initialize data
    async initializeData(): Promise<any> {

        this.vm.isLoading = true;

        let loggedInEmployee = await new Query()
            .filter({
                parentSchool: this.vm.user.activeSchool.dbId,
                mobileNumber: this.vm.user.username
            })
            .getObject({ employee_app: 'Employee' });
            
        let loggedInEmployeePermission = await new Query()
            .filter({
                parentEmployee: loggedInEmployee.id, 
            })
            .getObjectList({ employee_app: 'EmployeePermission' });

        loggedInEmployeePermission = loggedInEmployeePermission.find(permission => {return permission.parentTask === 42});
        
        let loggedInEmployeePermissionPermissionDict = JSON.parse(loggedInEmployeePermission.configJSON);
        // console.log(loggedInEmployeePermissionPermissionDict);

        const moduleQuery = new Query()
        .filter({
            __or__:[
                { parentBoard: this.vm.user.activeSchool.parentBoard}, 
                { parentBoard: null}
            ],
        })
        .getObjectList({ team_app: 'Module' });
        
        const taskQuery = new Query()
        .filter({
                __or__1:[
                    { parentBoard: this.vm.user.activeSchool.parentBoard}, 
                    { parentBoard: null}
                ],
                __or__2:[
                    { parentModule__parentBoard: this.vm.user.activeSchool.parentBoard}, 
                    { parentModule__parentBoard: null}
                ],
            })
            .getObjectList({ team_app: 'Task' });
        
        let moduleList, taskList;
        
        [
            moduleList,
            taskList
        ] = await Promise.all([
            moduleQuery,
            taskQuery
        ]);

        // console.log(moduleList, taskList);

        this.initializeModuleList(moduleList, taskList);

        if(Object.keys(loggedInEmployeePermissionPermissionDict).length !== 0) {
            
            let tempModuleList = [];      
            this.vm.moduleList.forEach(module => {
                let tempTaskList = [];
                let tempModule = module;
                
                module.taskList.forEach(task => {
                    if(loggedInEmployeePermissionPermissionDict[module.id][task.id] === true) {
                        tempTaskList.push(task);
                    }
                });
                
                if(tempTaskList.length) {
                    tempModule.taskList = tempTaskList;
                    tempModuleList.push(tempModule);
                }
            })
            
            this.vm.moduleList = tempModuleList;
        }
        
        this.intializeAssignTaskPermission();
        this.vm.isLoading = false;
    }

    intializeAssignTaskPermission(): any{

        let assign_task_permission = TASK_PERMISSION_LIST.find(task_permission => {return task_permission.modulePath === 'employees' && task_permission.taskPath === 'assign_task'});

        this.vm.moduleList.forEach(module => {
            let checkBoxValues = []
            module.taskList.forEach(task => {
                checkBoxValues.push([task.id, task.title]);
            })

            assign_task_permission.inPagePermissionMappedByKey[module.id]
                = new InPagePermission(
                    module.title,
                    'groupOfCheckBox',
                    null,
                    {},
                    checkBoxValues,
                );
        });  
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
            configJSON,
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
        const employeePermission = this.vm.hasPermission(employee, task);
        const data = {
            id: employeePermission.id,
        };
        await this.vm.employeeService.deleteObject(this.vm.employeeService.employee_permissions, data);
        this.vm.updatePermissionLoading(employee, task, false);
        this.vm.currentPermissionList = this.vm.currentPermissionList.filter(employeePermission => employeePermission.id != data.id);
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
                    toDeletePermissions.push(existingEmployeePermission.id );
                }
            });
        });

        const delete_request = {
            id__in: toDeletePermissions
        };

        const response = await this.vm.employeeService.deleteObjectList(this.vm.employeeService.employee_permissions, delete_request);
        this.vm.moduleList.forEach((module) => {
            module.taskList.forEach((task) => {
                const existingEmployeePermission = this.vm.hasPermission(employee, task);
                if (existingEmployeePermission) {
                    this.vm.updatePermissionLoading(employee, task, false);
                }
            });
        });
        toDeletePermissions.forEach(id => {
            this.vm.currentPermissionList = this.vm.currentPermissionList.filter(employeePermission => employeePermission.id != id);
        });
    }
}