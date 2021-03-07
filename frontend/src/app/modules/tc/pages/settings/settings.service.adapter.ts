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

        const request_tc_school_fee_rule = {
            name: this.vm.tcSchoolFeeRuleName,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        }

        this.vm.isLoading = true;
        Promise.all([
            this.vm.tcService.getObject(this.vm.tcService.tc_settings, request_tc_settings),    //  0
            this.vm.feeServie.getObjectList(this.vm.feeServie.fee_type, {}),    //  1
            this.vm.feeServie.getObject(this.vm.feeServie.school_fee_rules, request_tc_school_fee_rule),    //  2
        ]).then(data => {
            this.vm.tcSettings = data[0];
            this.vm.feeTypeList = data[1];
            if (data[2]) {
                this.vm.tcSchoolFeeRule = data[2];
                this.vm.tcSchoolFeeRuleInitilized = true;
            }
            else {
                this.vm.tcSchoolFeeRuleInitilized = false;
            }
            this.vm.isLoading = false;
        });
    }

    updateTcSettings() {
        this.vm.isLoading = true;
        return this.vm.tcService.updateObject(this.vm.tcService.tc_settings, this.vm.tcSettings).then(responseData => {
            this.vm.tcSettings = responseData;
            if (this.vm.tcSettings.parentFeeType) {
                if (this.vm.tcSchoolFeeRuleInitilized) {
                    this.vm.feeServie.updateObject(this.vm.feeServie.school_fee_rules, this.vm.tcSchoolFeeRule).then(res => {
                        this.vm.tcSchoolFeeRule = res;
                        this.vm.isLoading = false;
                    });
                }
                else {
                    this.vm.feeServie.createObject(this.vm.feeServie.school_fee_rules, this.vm.tcSchoolFeeRule).then(res => {
                        this.vm.tcSchoolFeeRule = res;
                        this.vm.tcSchoolFeeRuleInitilized = true;
                        this.vm.isLoading = false;
                    });
                }
            }
            else {
                this.vm.isLoading = false;
            }
        });
    }
}