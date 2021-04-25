import { SettingsComponent } from './settings.component';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    isAddButtonDisabled(): boolean {
        return this.vm.isAddLoading
            || !this.vm.userInput.selectedClass
            || !this.vm.userInput.selectedSection
            || !this.vm.userInput.startTime
            || !this.vm.userInput.endTime
            || this.vm.userInput.startTime > this.vm.userInput.endTime
            || this.vm.backendData.onlineClassList.find(activeClass => {
                return this.vm.userInput.selectedClass
                    && this.vm.userInput.selectedSection
                    && activeClass.parentClass == this.vm.userInput.selectedClass.id
                    && activeClass.parentDivision == this.vm.userInput.selectedSection.id;
            }) != undefined;
    }

    getWeekdays(): Array<string> {
        return Object.keys(this.vm.userInput.weekdays);
    }

    getClassDivisionName(classId, divisionId) {
        const classInstance = this.vm.backendData.classList.find(c => c.id == classId);
        const divisionInstance = this.vm.backendData.divisionList.find(d => d.id == divisionId);
        return classInstance.name + ' - ' + divisionInstance.name;
    }

}
