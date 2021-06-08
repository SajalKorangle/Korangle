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
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_settings, {
                parentSchool: this.vm.user.activeSchool.dbId,
            }),
        ]).then(
            (value) => {
                if (value[0].length > 0) {
                    let element = value[0][0];
                    this.vm.selectedSettings.id = element.id;
                    this.vm.selectedSettings.parentSchool = element.parentSchool;
                    this.vm.selectedSettings.sentUpdateType = element.sentUpdateType;
                    this.vm.selectedSettings.receiverType = element.receiverType;
                } else {
                    this.vm.selectedSettings.parentSchool = this.vm.user.activeSchool.dbId;
                    this.vm.selectedSettings.sentUpdateType = this.vm.sentUpdateList[0];
                    this.vm.selectedSettings.receiverType = this.vm.receiverList[1];
                    Promise.all([
                        this.vm.attendanceService.createObject(this.vm.attendanceService.attendance_settings, this.vm.selectedSettings),
                    ]).then((value) => {
                        this.vm.selectedSettings.id = value[0].id;
                    });
                }
                this.vm.currentSettings.receiverType = this.vm.selectedSettings.receiverType;
                this.vm.currentSettings.sentUpdateType = this.vm.selectedSettings.sentUpdateType;
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    updateSettings(): any {
        this.vm.isLoading = true;

        this.vm.selectedSettings.sentUpdateType = this.vm.currentSettings.sentUpdateType;
        this.vm.selectedSettings.receiverType = this.vm.currentSettings.receiverType;

        Promise.all([this.vm.attendanceService.updateObject(this.vm.attendanceService.attendance_settings, this.vm.selectedSettings)]).then(
            (value) => {
                alert('Settings Updated Successfully');
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
