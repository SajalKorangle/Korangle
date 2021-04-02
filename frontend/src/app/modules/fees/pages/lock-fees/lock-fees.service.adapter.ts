
import { LockFeesComponent } from './lock-fees.component';
import { Session } from '@services/modules/school/models/session';

export class LockFeesServiceAdapter {

    vm: LockFeesComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: LockFeesComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        this.vm.isLoading = true;

        this.vm.sessionList = await this.vm.schoolService.getObjectList(this.vm.schoolService.session, {});
        const activeSession: Session = this.vm.sessionList.find(s => s.id == this.vm.user.activeSchool.currentSessionDbId);
        this.populateActiveSession(activeSession);

        const lock_fee_list = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': activeSession.id,
        };

        const accounts_request = {
            accountType: 'ACCOUNT',
        }

        const account_session_request = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: activeSession.id,
        }

        const fee_payment_accounts_request = {
            'parentSession': activeSession.id,
        };

        const fee_settings_request = {
            'parentSession': activeSession.id,
        }

        const [lockFeesList, feePaymentAccountsList, accountSessionList, feeSettingsList, accountsList ] = await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.lock_fees, lock_fee_list),  // 0
            this.vm.feeService.getObjectList(this.vm.feeService.fee_payment_accounts, fee_payment_accounts_request),  // 1
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, account_session_request), // 2
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fee_settings_request), //3
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, accounts_request),  // 4
        ]);

        if (lockFeesList.length == 0) {
            this.vm.lockFees = null;
        } else if (lockFeesList.length == 1) {
            this.vm.lockFees = lockFeesList[0];
        } else {
            alert('Error: Report admin');
        }
        this.vm.feePaymentAccountsList = feePaymentAccountsList;
        this.vm.feeSettings = feeSettingsList[0];
        this.vm.accountSessionList = accountSessionList;
        this.vm.accountsList = accountsList;
        this.populateCustomAccountSession(this.vm.accountsList, this.vm.accountSessionList);

        this.vm.isLoading = false;
    }

    populateActiveSession(activeSession: Session):void {
        const today = new Date();
        const endDate = new Date(activeSession.endDate);
        const startDate = new Date(activeSession.startDate);
        this.vm.isActiveSession = today >= startDate && today <= endDate;
    }

    populateCustomAccountSession(accountsList, accountSessionList): void{
        this.vm.customAccountSessionList = accountSessionList.map(accountSession => {
            return {
                ...accountSessionList,
                type: 'ACCOUNT',
                title: accountsList.find(account=> account.id==accountSession.parentAccount).title,
            }
        })
    }

    lockFees(): void {

        this.vm.isLoading = true;

        let lock_fee_object = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.feeService.createObject(this.vm.feeService.lock_fees, lock_fee_object).then(value => {

            alert('Fee locked successfully');

            this.vm.lockFees = value;

            this.vm.isLoading = false;

        });

    }

    unlockFees(): void {

        this.vm.isLoading = true;

        this.vm.feeService.deleteObject(this.vm.feeService.lock_fees, this.vm.lockFees).then(value => {

            alert('Fee unlocked successfully');

            this.vm.lockFees = null;

            this.vm.isLoading = false;

        });

    }

    async updatePaymentSettings() {
        if (!this.vm.settingsValidityCheck())
            return;
        this.vm.isLoading = true;
        const fields_request = {
            fields_korangle: 'id',
        }
        const [feePaymentAccountsList, feeSettingsList] = await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_payment_accounts, fields_request),  // 1
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fields_request), //3
        ]);

        const serviceList = [];

        const newFeeSettings = { ...this.vm.feeSettings };
        if (feeSettingsList.length > 0) {   // i already exists
            newFeeSettings.id = feeSettingsList[0].id;
            serviceList.push(
                this.vm.feeService.updateObject(this.vm.feeService.fee_settings, newFeeSettings).then(res => this.vm.feeSettings = res)
            );
        } else {
            serviceList.push(   // 
                this.vm.feeService.createObject(this.vm.feeService.fee_settings, newFeeSettings).then(res => this.vm.feeSettings = res)
            );
        }

        const unchangeFeePaymentAccountList = this.vm.feePaymentAccountsList.filter(fpa=> feeSettingsList.find(f=> f.id==fpa.id)!=undefined);
        const toDeleteFeePaymentAccountList = feeSettingsList.filter(fpa=> this.vm.feePaymentAccountsList.find(f=> f.id==fpa.id)==undefined);
        const toCreateFeePaymentAccountList = this.vm.feePaymentAccountsList.filter(fpa=> feeSettingsList.find(f=> f.id==fpa.id)==undefined);
        if (toDeleteFeePaymentAccountList.length > 0) {
            serviceList.push(
                this.vm.feeService.deleteList(this.vm.feeService.fee_payment_accounts, toDeleteFeePaymentAccountList)
            );
        }

        serviceList.push(
            this.vm.feeService.createList(this.vm.feeService.fee_payment_accounts, toCreateFeePaymentAccountList).then(res => {
                this.vm.feePaymentAccountsList = [...unchangeFeePaymentAccountList, ...res];
            })
        )

        await Promise.all(serviceList);
        alert('fees accounting settings updated')
        this.vm.isLoading = false;
    }

    async deleteAccounting() {
        this.vm.isLoading = true;
        const fields_request = {
            fields_korangle: 'id',
        }
        const [feePaymentAccountsList, feeSettingsList] = await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_payment_accounts, fields_request),  // 1
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fields_request), //3
        ]);

        await Promise.all([
            this.vm.feeService.deleteList(this.vm.feeService.fee_payment_accounts, feePaymentAccountsList),
            this.vm.feeService.deleteList(this.vm.feeService.fee_settings, feeSettingsList),
        ]);
        this.vm.feeSettings = undefined;
        this.vm.feePaymentAccountsList = [];
        alert('fees accounting disabled successfully');
        this.vm.isLoading = false;
    }

}