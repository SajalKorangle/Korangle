
import { SettingsComponent } from './settings.component';
import { Session } from '@services/modules/school/models/session';

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        this.vm.isLoading = true;

        const sessionList = await this.vm.schoolService.getObjectList(this.vm.schoolService.session, {});
        const activeSession: Session = sessionList.find(s => s.id == this.vm.user.activeSchool.currentSessionDbId);
        this.populateActiveSession(activeSession);

        const fee_settings_request = {
            'parentSession': activeSession.id,
        }

        const accounts_request = {
            accountType: 'ACCOUNT',
        }

        const account_session_request = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: activeSession.id,
            parentAccount__accountType: 'ACCOUNT',
        }

        const [feeSettingsList, accountSessionList, accountsList ] = await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fee_settings_request), //3
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, account_session_request), // 2
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, accounts_request),  // 4
        ]);

        this.vm.backendData.accountSessionList = accountSessionList;
        this.vm.backendData.accountsList = accountsList;

        if (feeSettingsList.length == 0) {
            this.vm.backendData.applyDefaultSettings();
        } else if (feeSettingsList.length == 1) {
            this.vm.backendData.feeSettings = { ...feeSettingsList[0], accountingSettings: JSON.parse(feeSettingsList[0].accountingSettings)};
            this.vm.backendData.filterInvalidAccounts();
        } else {
            alert('Error: Report admin');
            return;
        }

        this.populateCustomAccountSession(this.vm.backendData.accountsList, this.vm.backendData.accountSessionList);

        this.vm.isLoading = false;
    }

    populateActiveSession(activeSession: Session): void {
        this.vm.activeSession = activeSession;
        const today = new Date();
        const endDate = new Date(activeSession.endDate);
        const startDate = new Date(activeSession.startDate);
        this.vm.isActiveSession = today >= startDate && today <= endDate;
    }

    populateCustomAccountSession(accountsList, accountSessionList): void{
        this.vm.customAccountSessionList = accountSessionList.map(accountSession => {
            return {
                ...accountSession,
                type: 'ACCOUNT',
                title: accountsList.find(account=> account.id==accountSession.parentAccount).title,
            }
        })
    }

    async updatePaymentSettings() {
        if (!this.vm.settingsValidityCheck())
            return;
        this.vm.isLoading = true;
        const fields_request = {
            fields_korangle: 'id',
        };
        const [feeSettingsList] = await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fields_request), // 0
        ]);

        const serviceList = [];

        const newFeeSettings:any = { ...this.vm.backendData.feeSettings };
        if (newFeeSettings.accountingSettings) {
            newFeeSettings.accountingSettings = JSON.stringify(newFeeSettings.accountingSettings);
        }
        if (feeSettingsList.length > 0) {   // i already exists
            newFeeSettings.id = feeSettingsList[0].id;
            serviceList.push(
                this.vm.feeService.updateObject(this.vm.feeService.fee_settings, newFeeSettings).then(res => this.vm.backendData.feeSettings = { ...res , accountingSettings: JSON.parse(res.accountingSettings)})
            );
        } else {
            serviceList.push(   // 
                this.vm.feeService.createObject(this.vm.feeService.fee_settings, newFeeSettings).then(res => this.vm.backendData.feeSettings = { ...res , accountingSettings: JSON.parse(res.accountingSettings)})
            );
        }
        await Promise.all(serviceList);

        alert('fees accounting settings updated')
        this.vm.isLoading = false;
    }

}