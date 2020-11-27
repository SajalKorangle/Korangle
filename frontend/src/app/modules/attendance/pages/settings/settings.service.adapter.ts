import { SettingsComponent } from './settings.component'

export class SettingsServiceAdapter{

    vm : SettingsComponent;
    settingsDoesNotExist: boolean = true;

    constructor() {}

    initializeAdapter(vm: SettingsComponent):void{
        this.vm = vm;
    }

    initializeData(): void{

        this.vm.isInitialLoading = true;
        this.settingsDoesNotExist = true;
        Promise.all([
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_settings, {})
        ]).then(value => {
            if(value[0].length == 0)
                this.settingsDoesNotExist = true;
            else{
                value[0].forEach(element => {
                    if(element.parentSchool == this.vm.user.activeSchool.dbId){
                        this.settingsDoesNotExist = false;
                        this.vm.selectedSettings.id = element.id;
                        this.vm.selectedSettings.parentSchool = element.parentSchool;
                        this.vm.selectedSettings.sentUpdateType = element.sentUpdateType;
                        this.vm.selectedSettings.sentUpdateToType = element.sentUpdateToType;
                    }
                });
            }
            if(this.settingsDoesNotExist){
                this.vm.selectedSettings.parentSchool = this.vm.user.activeSchool.dbId;
                this.vm.selectedSettings.sentUpdateType = 'SMS';
                this.vm.selectedSettings.sentUpdateToType = 'All Students';
                this.vm.attendanceService.createObject(this.vm.attendanceService.attendance_settings,this.vm.selectedSettings);                
            }
            this.vm.currentSettings = this.vm.selectedSettings;
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });
    }

    updateSettings(): any{
        if (this.vm.currentSettings.sentUpdateType === null) {
            alert('Select Send Via Type');
            return;
        }
        if (this.vm.currentSettings.sentUpdateToType === null) {
            alert('Select Send Update To Type');
            return;
        }
        this.vm.selectedSettings.sentUpdateType = this.vm.currentSettings.sentUpdateType;
        this.vm.selectedSettings.sentUpdateToType = this.vm.currentSettings.sentUpdateToType;
        
        Promise.all([
            this.vm.attendanceService.updateObject(this.vm.attendanceService.attendance_settings, this.vm.currentSettings)
        ]).then(value => {
            alert('Settings Updated Successfully');
            // console.log(this.vm.selectedSettings);
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });
        
    }
}