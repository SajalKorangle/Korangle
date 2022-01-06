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
}
