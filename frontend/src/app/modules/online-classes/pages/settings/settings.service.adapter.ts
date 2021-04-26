import { OnlineClassesComponent } from '@modules/online-classes/online-classes.component';
import { SettingsComponent } from './settings.component';

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.isLoading = true;

        let fetch_online_class_list = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let apiCallbackResult = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, fetch_online_class_list), // 2
        ]);
        this.vm.backendData.classList = apiCallbackResult[0];
        this.vm.backendData.divisionList = apiCallbackResult[1];
        this.vm.backendData.onlineClassList
            = apiCallbackResult[2].map(onlineClass => { return { ...onlineClass, configJSON: JSON.parse(onlineClass.configJSON) }; });

        this.vm.isLoading = false;

    }

    async createActiveClass() {

        this.vm.isAddLoading = true;

        const new_online_class = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentClass: this.vm.userInput.selectedClass.id,
            parentDivision: this.vm.userInput.selectedSection.id,
            startTime: this.vm.userInput.startTime,
            endTime: this.vm.userInput.endTime,
            configJSON: JSON.stringify({ weekdays: this.vm.userInput.weekdays }),
        };

        let apiCallbackResult =
            await this.vm.onlineClassService.createObject(this.vm.onlineClassService.online_class,
                new_online_class);

        this.vm.backendData.onlineClassList.push(apiCallbackResult);

        this.vm.isAddLoading = false;

    }

}
