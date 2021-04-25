import { SettingsComponent } from './settings.component';

export class SettingsUserInput {

    selectedClass: any;
    selectedSection: any;
    startTime: any;
    endTime: any;
    weekDays: Array<boolean> = Array.from({ length: 7 }, (_, index) => index < 6 ? true : false);


    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
