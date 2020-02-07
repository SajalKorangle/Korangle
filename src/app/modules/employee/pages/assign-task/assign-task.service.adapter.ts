
import {AssignTaskComponent} from "./assign-task.component";

export class AssignTaskServiceAdapter {

    vm: AssignTaskComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: AssignTaskComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {

        let module_data = {
            'parentBoard__or': this.vm.user.activeSchool.parentBoard,
            'parentBoard': 'null__korangle',
        };

        let task_data = {
            'parentBoard__or': this.vm.user.activeSchool.parentBoard,
            'parentBoard': 'null__korangle',
            'parentModule__parentBoard__or': this.vm.user.activeSchool.parentBoard,
            'parentModule__parentBoard': 'null__korangle',
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.teamService.getObjectList(this.vm.teamService.module, module_data),
            this.vm.teamService.getObjectList(this.vm.teamService.task, task_data),
        ]).then(value => {

            this.initializeModuleList(value[0],value[1]);
            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    getPermissionList(): void {
        const data = {};
        if (this.vm.selectedAssignTaskOption === this.vm.assignTaskOptions[0]){
            data['parentEmployee'] = this.vm.selectedEmployee.id;
        } else {
            data['parentTask'] = this.vm.selectedTask.id;
        }
        this.vm.isLoading = true;
        Promise.all([
            this.vm.employeeService.getObjectList(this.vm.employeeService.employee_permissions, data)
            ]).then(value => {
                this.vm.currentPermissionList = value[0];
                this.vm.isLoading = false;
        }, error => {
                this.vm.isLoading = false;
        });
    }

    initializeModuleList(moduleList: any, taskList: any): void {
        this.vm.moduleList = moduleList;
        this.vm.moduleList.forEach(module => {
            module.taskList = taskList.filter(task => {
                task.selected = false;
                return task.parentModule == module.id;
            }).sort( (a,b) => {
                return a.orderNumber - b.orderNumber;
            });
        })
        this.vm.moduleList = this.vm.moduleList.sort( (a,b) => {
            return a.orderNumber - b.orderNumber;
        });
    }

}