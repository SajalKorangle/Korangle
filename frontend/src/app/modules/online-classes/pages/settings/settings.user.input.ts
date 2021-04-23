import {SettingsComponent} from './settings.component';

export class SettingsUserInput {

    selectedClass: any;
    selectedSection: any;
    startTime: any;
    endTime: any;


    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

}
