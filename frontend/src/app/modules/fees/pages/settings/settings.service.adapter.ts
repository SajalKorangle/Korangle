import { SettingsComponent } from './settings.component';
import { Session } from '@services/modules/school/models/session';
import { CommonFunctions } from '@modules/common/common-functions';
import { Query } from '@services/generic/query';

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        this.vm.isLoading = true;

        const sessionList = await this.vm.schoolService.getObjectList(this.vm.schoolService.session, {});
        const activeSession: Session = sessionList.find(s => s.id == this.vm.user.activeSchool.currentSessionDbId);
        this.populateActiveSession(activeSession, sessionList);

        const fee_settings_request = {
            'parentSession': activeSession.id,
        };

        const accounts_request = {
            accountType: 'ACCOUNT',
        };

        const account_session_request = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: activeSession.id,
            parentAccount__accountType: 'ACCOUNT',
        };

        const [feeSettingsList, accountSessionList, accountsList, schoolMerchantAccount, feeSchoolSettingsList] = await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fee_settings_request), //0
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, account_session_request), // 1
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, accounts_request),  // 2
            new Query().filter({parentSchool: this.vm.user.activeSchool.dbId}).getObject({payment_app: 'SchoolMerchantAccount'}), // 3
            this.vm.genericService.getObjectList({ fees_third_app: 'FeeSchoolSettings' }, {filter: {parentSchool: this.vm.user.activeSchool.dbId}}), // 4
        ]);

        this.vm.backendData.accountSessionList = accountSessionList;
        this.vm.backendData.accountsList = accountsList;
        this.vm.backendData.schoolMerchantAccount = schoolMerchantAccount;
        if (feeSchoolSettingsList.length == 1) {
            this.vm.printSingleReceipt = feeSchoolSettingsList[0]["printSingleReceipt"];
        }

        if (feeSettingsList.length == 0) {
            this.vm.backendData.applyDefaultSettings();
        } else if (feeSettingsList.length == 1) {
            this.vm.backendData.feeSettings = feeSettingsList[0];
            this.vm.backendData.filterInvalidAccounts();
        } else {
            alert('Error: Report admin');
            return;
        }

        this.populateCustomAccountSession(this.vm.backendData.accountsList, this.vm.backendData.accountSessionList);

        this.vm.isLoading = false;
    }

    populateActiveSession(activeSession: Session, sessionList: any): void {
        this.vm.activeSession = activeSession;
        this.vm.isActiveSession = CommonFunctions.isSessionActive(activeSession.id, sessionList);
    }

    populateCustomAccountSession(accountsList, accountSessionList): void {
        this.vm.customAccountSessionList = accountSessionList.map(accountSession => {
            return {
                ...accountSession,
                type: 'ACCOUNT',
                title: accountsList.find(account => account.id == accountSession.parentAccount).title,
            };
        });
    }

    async updatePaymentSettings() {
        if (!this.vm.settingsValidityCheck())
            return;
        this.vm.isLoading = true;
        const fields_request = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            fields__korangle: 'id',
        };
        const [feeSettingsList] = await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fields_request), // 0
        ]);

        const serviceList = [];

        const newFeeSettings: any = { ...this.vm.backendData.feeSettings };
        if (newFeeSettings.accountingSettings) {
            newFeeSettings.accountingSettings = JSON.stringify(newFeeSettings.accountingSettings);
        }
        if (feeSettingsList.length > 0) {   // i already exists
            newFeeSettings.id = feeSettingsList[0].id;
            serviceList.push(
                this.vm.feeService.updateObject(this.vm.feeService.fee_settings, newFeeSettings)
                    .then(res => this.vm.backendData.feeSettings = res)
            );
        } else {
            serviceList.push(   //
                this.vm.feeService.createObject(this.vm.feeService.fee_settings, newFeeSettings)
                    .then(res => this.vm.backendData.feeSettings = res)
            );
        }

        if (this.vm.backendData.schoolMerchantAccount) {
            serviceList.push(
                new Query().partiallyUpdateObject(
                    {payment_app: 'SchoolMerchantAccount'},
                    this.vm.backendData.schoolMerchantAccount
                    )
            );
        }

        await Promise.all(serviceList);

        alert('fees accounting settings updated');
        this.vm.isLoading = false;
    }

    async updatePrintSingleReceipt() {
        this.vm.isLoadingPrintSingleReceiptSetting = true;

        const [feeSchoolSettingsList] = await Promise.all([
            this.vm.genericService.getObjectList({ fees_third_app: 'FeeSchoolSettings' }, {}),
        ]);

        const newFeeSchoolSettings: any = { printSingleReceipt: this.vm.printSingleReceipt, parentSchool: this.vm.user.activeSchool.dbId };

        if (feeSchoolSettingsList.length > 0) {
            newFeeSchoolSettings.id = feeSchoolSettingsList[0].id;
            await this.vm.genericService.updateObject({ fees_third_app: 'FeeSchoolSettings' }, newFeeSchoolSettings);
        } else {
            await this.vm.genericService.createObject({ fees_third_app: 'FeeSchoolSettings' }, newFeeSchoolSettings);
        }

        this.vm.isLoadingPrintSingleReceiptSetting = false;
    }

}