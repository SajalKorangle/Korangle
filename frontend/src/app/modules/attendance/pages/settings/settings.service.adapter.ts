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
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_settings, {'parentSchool': this.vm.user.activeSchool.dbId})
        ]).then(value => {
            console.log(value[0]);
            if(value[0].length == 0)
                this.settingsDoesNotExist = true;
            else{
                let element  = value[0][0];
                this.settingsDoesNotExist = false;
                this.vm.selectedSettings.id = element.id;
                this.vm.selectedSettings.parentSchool = element.parentSchool;
                this.vm.selectedSettings.sentUpdateType = element.sentUpdateType;
                this.vm.selectedSettings.sentUpdateToType = element.sentUpdateToType;
        
            }
            if(this.settingsDoesNotExist){
                this.vm.selectedSettings.parentSchool = this.vm.user.activeSchool.dbId;
                this.vm.selectedSettings.sentUpdateType = 'SMS';
                this.vm.selectedSettings.sentUpdateToType = 'All Students';
                Promise.all([this.vm.attendanceService.createObject(this.vm.attendanceService.attendance_settings,this.vm.selectedSettings)])       
            }
            this.vm.currentSettings.sentUpdateToType = this.vm.selectedSettings.sentUpdateToType;
            this.vm.currentSettings.sentUpdateType = this.vm.selectedSettings.sentUpdateType;
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });
    }

    updateSettings(): any{
        
        this.vm.isInitialLoading = true;
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
            this.vm.attendanceService.updateObject(this.vm.attendanceService.attendance_settings, this.vm.selectedSettings)
        ]).then(value => {
            this.vm.settingsChanged = false;
            alert('Settings Updated Successfully');
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });
        
    }
}