import { ManageAccountsComponent } from './manage-accounts.component';
import { Account } from './../../../../services/modules/accounts/models/account';
import { AccountSession } from './../../../../services/modules/accounts/models/account-session';
import { group } from '@angular/animations';

export class ManageAccountsServiceAdapter {

    vm: ManageAccountsComponent;
    constructor() {}
    // Data

    initializeAdapter(vm: ManageAccountsComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        const lock_accounts_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.accountsService.getObjectList(this.vm.accountsService.lock_accounts, lock_accounts_data).then(value => {
            if (value.length == 1) {
                this.vm.lockAccounts = true;
                this.vm.isLoading = false;
            } else if (value.length == 0) {

                const request_account_data = {
                    parentSchool: this.vm.user.activeSchool.dbId,
                };

                const request_account_session_data = {
                    'parentAccount__parentSchool': this.vm.user.activeSchool.dbId,
                    'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                };

                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),  // 0
                    this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),   // 1
                    this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 2
                ]).then(value => {

                    const currentSession = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
                    this.vm.minimumDate = currentSession.startDate;  // change for current session
                    this.vm.maximumDate = currentSession.endDate;

                    this.initialiseAccountGroupList(value[1], value[0]);
                    this.initialiseDisplayData();
                    this.vm.isLoading = false;

                });
            }
            else {
                this.vm.isLoading = false;
                alert("Unexpected errors. Please contact admin");
            }
        });
    }

    initialiseAccountGroupList(accountSessionList: Array<AccountSession>, accountList: Array<Account>): void {
        this.vm.backendData.accountsList = accountList;
        this.vm.accountsList = [];
        this.vm.groupsList = [];
        accountSessionList.forEach(accountSession => {
            let acc = accountList.find(account => account.id == accountSession.parentAccount);
            const customAccount = { ...accountSession, type: acc.accountType, title: acc.title };
            if (acc.accountType == 'ACCOUNT') {
                this.vm.accountsList.push(customAccount);
            }
            else {
                this.vm.groupsList.push(customAccount);
            }
        });
    }


    initialiseDisplayData() {
        const nonIndividualAccount = JSON.parse(JSON.stringify(this.vm.accountsList.filter(accountSession => accountSession.parentGroup)));
        const individualAccountList = JSON.parse(JSON.stringify(this.vm.accountsList.filter(accountSession => !accountSession.parentGroup)));
        const groupStructureList = JSON.parse(JSON.stringify(this.vm.groupsList)).map(group => {
            return { ...group, childs: [] }; // structure of group
        });

        nonIndividualAccount.forEach(accountSession => {    // pushing all accounts with parentGroup in child of its group
            groupStructureList.find(g => g.parentAccount == accountSession.parentGroup).childs.push(accountSession);
        });

        for (let i = 0; i < groupStructureList.length; i++) {
            if (groupStructureList[i].parentGroup) {
                groupStructureList.find(group => group.parentAccount == groupStructureList[i].parentGroup).childs.push(groupStructureList[i]);
            }
        }
        const rootGroupStructureList = groupStructureList.filter(group => !group.parentGroup);
        this.populateHeadWiseDisplayList(rootGroupStructureList, individualAccountList);

    }

    populateHeadWiseDisplayList(groupsList, individualAccountList) {
        Object.keys(this.vm.hierarchyStructure).forEach(key => this.vm.hierarchyStructure[key] = []);   // empty array for all heads
        groupsList.forEach(group => {
            let head = this.vm.headsList.find(head => head.id == group.parentHead).title;
            this.vm.hierarchyStructure[head].push(group);

        });
        individualAccountList.forEach(accountSession => {
            let head = this.vm.headsList.find(head => head.id == accountSession.parentHead).title;
            this.vm.hierarchyStructure[head].push(accountSession);
        });
    }

}
