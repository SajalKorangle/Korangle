import { SettingsComponent } from './settings.component';
import { DEFAULT_START_TIME_STRING, DEFAULT_END_TIME_STRING } from '@modules/online-classes/class/constants';

export class SettingsUserInput {

    selectedClass: any;
    selectedSection: any;

    newTimeSpan: { startTime: string, endTime: string; } = { startTime: DEFAULT_START_TIME_STRING, endTime: DEFAULT_END_TIME_STRING };

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
