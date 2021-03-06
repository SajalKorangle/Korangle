import {SettingsComponent } from './settings.component';

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() { }
    
    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    initializeData() {

        const request_tc_settings = {
            parentSchool: this.vm.user.activeSchool.dbId,
        }

        this.vm.isLoading = true;
        Promise.all([
            this.vm.tcService.getObject(this.vm.tcService.tc_settings, request_tc_settings), //0
            this.vm.feeServie.getObjectList(this.vm.feeServie.fee_type, {})
        ]).then(data => {
            this.vm.tcSettings = data[0];
            this.vm.feeTypeList = data[1];
            this.vm.isLoading = false;
        });
    }

    updateTcSettings(newSettingsData) {
        this.vm.isLoading = true;
        return this.vm.tcService.updateObject(this.vm.tcService.tc_settings, newSettingsData).then(responseData => {
            this.vm.tcSettings = responseData;
            this.vm.isLoading = false;
        });
    }
}