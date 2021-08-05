import { SettingsComponent } from './settings.component';
import { DEFAULT_START_TIME_STRING, DEFAULT_END_TIME_STRING } from '@modules/online-classes/class/constants';

export class SettingsUserInput {

    private _selectedClass: any;
    private _selectedSection: any;

    selectedEmployee: any;

    newTimeSpan: { startTime: string, endTime: string; };

    vm: SettingsComponent;

    constructor() {
        this.resetNewTimeSpanData();
    }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    get selectedClass() {
        return this._selectedClass;
    }

    set selectedClass(selectedClassValue) {
        this.vm.htmlRenderer.editTimeSpanFormIndex = -1;    // reset display for new time table
        this.vm.htmlRenderer.newTimeSpanForm = false;
        this._selectedClass = selectedClassValue;
    }

    get selectedSection() {
        return this._selectedSection;
    }

    set selectedSection(selectedSectionValue) {
        this.vm.htmlRenderer.editTimeSpanFormIndex = -1;    // reset display for new time table
        this.vm.htmlRenderer.newTimeSpanForm = false;
        this._selectedSection = selectedSectionValue;
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
