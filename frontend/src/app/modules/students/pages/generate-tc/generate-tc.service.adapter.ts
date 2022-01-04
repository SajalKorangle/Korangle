import { GenerateTcComponent } from './generate-tc.component';
import { CommonFunctions } from '@classes/common-functions';

export class GenerateTCServiceAdapter {
    vm: GenerateTcComponent;

    constructor() {}

    initializeAdapter(vm: GenerateTcComponent): void {
        this.vm = vm;
    }

    async createRecord(action) {
        let parentEmployee = this.vm.user.activeSchool.employeeId;
        let moduleName = this.vm.user.section.title;
        let taskName = this.vm.user.section.subTitle;
        let moduleList = this.vm.user.activeSchool.moduleList;
        let parentTask;
        moduleList.forEach((module) => {
            if(moduleName === module.title) {
                let tempTaskList = module.taskList;
                tempTaskList.forEach((task) => {
                    if(taskName === task.title) {
                        parentTask = task.dbId;
                    }
                });
            }
        });

        let recordObject = {};
        recordObject["parentTask"] = parentTask;
        recordObject["parentEmployee"] = parentEmployee;
        recordObject["activityDescription"] = this.vm.user.first_name + " " + action + " transfer certificate of " + this.vm.selectedStudent.name;
        let record_list = [recordObject];
        const response = await this.vm.genericService.createObjectList({activity_record_app: 'ActivityRecord'}, record_list);
    }
}
