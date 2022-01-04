import { PrintProfileComponent } from './print-profile.component';

export class PrintProfileServiceAdapter {
    vm: PrintProfileComponent;

    constructor() {}

    initializeAdapter(vm: PrintProfileComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        const dataForBusStop = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),
            this.vm.schoolService.getObjectList(this.vm.schoolService.bus_stop, dataForBusStop),
        ]).then(
            (value) => {
                this.vm.sessionList = value[0];
                this.vm.boardList = value[1];
                this.vm.busStopList = value[2];
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getStudentProfile(studentId: any): void {
        this.vm.isLoading = true;
        let data = {
            id: studentId,
        };
        this.vm.studentService.getObject(this.vm.studentService.student, data).then((value) => {
            console.log(value);
            this.vm.selectedStudent = value;
            this.vm.isLoading = false;
        });
    }

    async createRecord() {
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
        console.log("parentTask: ", parentTask);

        let recordObject = {};
        recordObject["parentTask"] = parentTask;
        recordObject["parentEmployee"] = parentEmployee;
        recordObject["activityDescription"] = this.vm.user.first_name + " printed profile of " + this.vm.selectedStudent.name;
        let record_list = [recordObject];
        const response = await this.vm.genericService.createObjectList({activity_record_app: 'ActivityRecord'}, record_list);
    }
}
