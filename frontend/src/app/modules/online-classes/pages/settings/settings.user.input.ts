import { SettingsComponent } from './settings.component';

export class SettingsUserInput {

    selectedClass: any;
    selectedSection: any;
    startTime: any;
    endTime: any;
    weekdays = {
        'Sunday': false,
        'Monday': true,
        'Tuesday': true,
        'Wednesday': true,
        'Thursday': true,
        'Friday': true,
        'Saturday': true
    };

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
