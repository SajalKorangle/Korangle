import { SettingsComponent } from './settings.component'

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() {}

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.isInitialLoading = true;
        
        this.vm.sentUpdateType = 'NOTIFICATION';
        this.vm.sendEditUpdate = true;
        this.vm.sendCreateUpdate = true;
        this.vm.sendDeleteUpdate = true;
        this.vm.sendCheckUpdate = true;
        this.vm.sendResubmissionUpdate = true;
        
        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_settings, {'parentSchool' : this.vm.user.activeSchool.dbId}),
        ]).then(value =>{
            if(value[0].length == 0){
                let tempSettings = {
                    'parentSchool' : this.vm.user.activeSchool.dbId,
                    'sentUpdateType': 'NOTIFICATION',
                    'sendCreateUpdate': true,
                    'sendEditUpdate': true,
                    'sendDeleteUpdate': true,
                    'sendCheckUpdate': true,
                    'sendResubmissionUpdate': true,
                }
                Promise.all([
                    this.vm.homeworkService.createObject(this.vm.homeworkService.homework_settings, tempSettings)
                ]).then(value =>{
                    this.vm.previousSettings = value[0];
                    this.vm.isInitialLoading = false;
                })
            }
            else{
                this.vm.previousSettings = value[0][0];
                this.vm.sentUpdateType = this.vm.previousSettings.sentUpdateType;
                this.vm.sendEditUpdate = this.vm.previousSettings.sendEditUpdate;
                this.vm.sendCreateUpdate = this.vm.previousSettings.sendCreateUpdate;
                this.vm.sendDeleteUpdate = this.vm.previousSettings.sendDeleteUpdate;
                this.vm.sendCheckUpdate = this.vm.previousSettings.sendCheckUpdate;
                this.vm.sendResubmissionUpdate = this.vm.previousSettings.sendResubmissionUpdate;
                this.vm.isInitialLoading = false;
            }
        },error =>{
            this.vm.isInitialLoading = false;
        });
    }

    updateSettings(): any{

        this.vm.isInitialLoading = true;
        let tempSettings ={
            'id': this.vm.previousSettings.id,
            'sentUpdateType': this.vm.sentUpdateType,
            'sendCreateUpdate': this.vm.sendCreateUpdate,
            'sendEditUpdate': this.vm.sendEditUpdate,
            'sendDeleteUpdate': this.vm.sendDeleteUpdate,
            'sendCheckUpdate': this.vm.sendCheckUpdate,
            'sendResubmissionUpdate': this.vm.sendResubmissionUpdate,
        }
        Promise.all([
            this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_settings, tempSettings),
        ]).then(value =>{
            alert('Settings Updated');
            this.vm.settingsChanged = false;
            this.vm.previousSettings = value[0];
            this.vm.isInitialLoading = false;
        },error =>{
            this.vm.isInitialLoading = false;
        })
    }
}