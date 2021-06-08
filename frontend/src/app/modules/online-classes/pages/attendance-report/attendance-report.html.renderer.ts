import {AttendanceReportComponent} from './attendance-report.component';

export class AttendanceReportHtmlRenderer {

    vm: AttendanceReportComponent;

    constructor() { }

    initialize(vm: AttendanceReportComponent): void {
        this.vm = vm;
    }

}
