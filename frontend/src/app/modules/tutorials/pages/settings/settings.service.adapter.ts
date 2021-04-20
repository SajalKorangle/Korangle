import { SettingsComponent } from './settings.component';

export class SettingsServiceAdapter {
    vm: SettingsComponent;

    constructor() {}

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        this.vm.isLoading = true;
        Promise.all([
            this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial_settings, {
                parentSchool: this.vm.user.activeSchool.dbId,
            }),
        ]).then(
            (value) => {
                if (value[0].length > 0) {
                    this.vm.previousSettings = value[0][0];
                    this.vm.sentUpdateType = this.vm.sentUpdateList[this.vm.previousSettings.sentUpdateType - 1];
                    this.vm.sendCreateUpdate = this.vm.previousSettings.sendCreateUpdate;
                    this.vm.sendEditUpdate = this.vm.previousSettings.sendEditUpdate;
                    this.vm.sendDeleteUpdate = this.vm.previousSettings.sendDeleteUpdate;
                    this.vm.isLoading = false;
                } else {
                    this.vm.previousSettings = {
                        parentSchool: this.vm.user.activeSchool.dbId,
                        sentUpdateType: this.vm.getSentUpdateTypeIndex('NULL') + 1,
                        sendCreateUpdate: false,
                        sendEditUpdate: false,
                        sendDeleteUpdate: false,
                    };
                    Promise.all([
                        this.vm.tutorialService.createObject(this.vm.tutorialService.tutorial_settings, this.vm.previousSettings),
                    ]).then((value) => {
                        console.log(value);
                        this.vm.previousSettings = value[0];
                        this.vm.sentUpdateType = this.vm.sentUpdateList[this.vm.previousSettings.sentUpdateType - 1];
                        this.vm.sendCreateUpdate = this.vm.previousSettings.sendCreateUpdate;
                        this.vm.sendEditUpdate = this.vm.previousSettings.sendEditUpdate;
                        this.vm.sendDeleteUpdate = this.vm.previousSettings.sendDeleteUpdate;
                        this.vm.isLoading = false;
                    });
                }
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    updateSettings(): any {
        this.vm.isLoading = true;
        (this.vm.previousSettings.sentUpdateType = this.vm.getSentUpdateTypeIndex(this.vm.sentUpdateType) + 1),
            (this.vm.previousSettings.sendCreateUpdate = this.vm.sendCreateUpdate);
        this.vm.previousSettings.sendEditUpdate = this.vm.sendEditUpdate;
        this.vm.previousSettings.sendDeleteUpdate = this.vm.sendDeleteUpdate;
        Promise.all([this.vm.tutorialService.updateObject(this.vm.tutorialService.tutorial_settings, this.vm.previousSettings)]).then(
            (value) => {
                this.vm.previousSettings = value[0];
                alert('Settings Updated Successfully');
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
