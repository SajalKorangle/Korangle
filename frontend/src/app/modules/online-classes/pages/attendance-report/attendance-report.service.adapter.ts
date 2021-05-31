import {AttendanceReportComponent} from './attendance-report.component';

export class AttendanceReportServiceAdapter {

    vm: AttendanceReportComponent;

    constructor() { }

    initialize(vm: AttendanceReportComponent): void {
        this.vm = vm;
    }

}
