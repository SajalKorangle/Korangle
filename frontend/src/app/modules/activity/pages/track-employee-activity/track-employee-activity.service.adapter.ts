import { TrackEmployeeActivityComponent } from './track-employee-activity.component';


export class TrackEmployeeActivityServiceAdapter {
    vm: TrackEmployeeActivityComponent;

    constructor() {}

    initializeAdapter(vm: TrackEmployeeActivityComponent): void {
        this.vm = vm;
    }

    initializeData() {
        this.vm.isLoading = true;
        Promise.all([
            this.vm.genericService.getObjectList({activity_app: 'ActivityRecord'}, {filter: {parentEmployee__parentSchool: this.vm.user.activeSchool.dbId}}), // 0
        ]).then(
            (value) => {
                // this.vm.activityRecordList = value[0];
                console.log("Data: ", value[0]);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
