import {SettingsComponent} from './settings.component';

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.isLoading = true;

        let fetch_active_class_list = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let apiCallbackResult = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.active_class, fetch_active_class_list) // 2
        ]);
        this.vm.backendData.classList = apiCallbackResult[0];
        this.vm.backendData.divisionList = apiCallbackResult[1];
        this.vm.backendData.activeClassList = apiCallbackResult[2];

        this.vm.isLoading = false;

    }

    async createActiveClass() {

        this.vm.isAddLoading = true;

        let add_active_class = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentClass: this.vm.userInput.selectedClass.id,
            parentDivision: this.vm.userInput.selectedSection.id,
            startTime: this.vm.userInput.startTime,
            endTime: this.vm.userInput.endTime,
        };

        let apiCallbackResult = 
            await this.vm.onlineClassService.createObject(this.vm.onlineClassService.active_class,
                                                        add_active_class);
        
        this.vm.backendData.activeClassList.push(apiCallbackResult);

        this.vm.isAddLoading = false;

    }

}
