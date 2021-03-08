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
            this.vm.tcService.getObject(this.vm.tcService.tc_settings, request_tc_settings),    //  0
            this.vm.feeServie.getObjectList(this.vm.feeServie.fee_type, {}),    //  1
        ]).then(data => {
            if (data[0]) {
                this.vm.tcSettings = data[0];
            }
            this.vm.feeTypeList = data[1];
            this.vm.isLoading = false;
        });
    }

    updateTcSettings() {
        this.vm.isLoading = true;
        const serviceList = []
        if (this.vm.tcSettings.id) {
            serviceList.push(this.vm.tcService.updateObject(this.vm.tcService.tc_settings, this.vm.tcSettings));
        }
        else {
            serviceList.push(this.vm.tcService.createObject(this.vm.tcService.tc_settings, this.vm.tcSettings));
        }
        return Promise.all(serviceList).then(response => {
            this.vm.tcSettings = response[0];
            this.vm.isLoading = false
        });
    }
}