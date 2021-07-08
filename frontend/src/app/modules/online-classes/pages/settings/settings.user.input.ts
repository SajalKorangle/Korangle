import { SettingsComponent } from './settings.component';
import { DEFAULT_START_TIME_STRING, DEFAULT_END_TIME_STRING } from '@modules/online-classes/class/constants';

export class SettingsUserInput {

    selectedClass: any;
    selectedSection: any;

    selectedEmployee: any;

    newTimeSpan: { startTime: string, endTime: string; };

    vm: SettingsComponent;

    constructor() {
        this.resetNewTimeSpanData();
    }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    resetNewTimeSpanData() {
        this.newTimeSpan = { startTime: DEFAULT_START_TIME_STRING, endTime: DEFAULT_END_TIME_STRING };
    }

    resetInput() {
        this.selectedEmployee = null;
        this.selectedClass = null;
        this.selectedSection = null;
    }

}
