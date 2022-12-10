import { TransferBalanceComponent } from './transfer-balance.component';
import { Account } from '@services/modules/accounts/models/account';
import { AccountSession } from '@services/modules/accounts/models/account-session';
export class TransferBalanceServiceAdapter {

    vm: TransferBalanceComponent;
    constructor() { }
    // Data

    initializeAdapter(vm: TransferBalanceComponent): void {
        this.vm = vm;
    }

    initializeData(): void {

        this.vm.isLoading = true;
        let accounts_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let current_session_accounts_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        };

        let next_session_accounts_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId + 1,
        };

        Promise.all([
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 0
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, accounts_data), // 1
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, current_session_accounts_data), // 2
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, next_session_accounts_data), //3
        ]).then(value => {
            this.vm.currentSession = value[0].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
            this.vm.nextSession = value[0].find(session => session.orderNumber == (this.vm.currentSession.orderNumber + 1));
            this.vm.selectedSession = this.vm.currentSession;
            this.vm.accountList = value[1];
            this.populateNextSessionAccountSessionList(value[3]);
            this.populateCurrentSessionAccountSessionList(value[2]);
            this.initialiseDisplayData(this.vm.currentSessionAccountSessionList, this.vm.currentSessionHierarchyStructure);
            this.initialiseDisplayData(this.vm.nextSessionAccountSessionList, this.vm.nextSessionHierarchyStructure);
            this.vm.isLoading = false;
        });
    }

    populateNextSessionAccountSessionList(nextSessionAccountSessionLst: Array<AccountSession>): void {
        this.vm.nextSessionAccountSessionList = [];
        nextSessionAccountSessionLst.forEach(accountSession => {
            let acc = this.vm.accountList.find(account => account.id == accountSession.parentAccount);
            const customAccount = { ...accountSession, type: acc.accountType, title: acc.title };
            this.vm.nextSessionAccountSessionList.push(customAccount);
        });
    }

    populateCurrentSessionAccountSessionList(currentAccountsSessionList: Array<AccountSession>) {
        this.vm.currentSessionAccountSessionList = [];
        for (let i = 0; i < currentAccountsSessionList.length; i++) {
            const accountSession = currentAccountsSessionList[i];
            const acc = this.vm.accountList.find(accounts => accounts.id == accountSession.parentAccount);
            const customAccount =
            {
                ...accountSession,
                type: acc.accountType,
                title: acc.title,
                selected: false,
                disabled: false,
            };
            const nextSessionAccount = this.vm.nextSessionAccountSessionList.find(acc => acc.parentAccount == accountSession.parentAccount);
            if (nextSessionAccount != undefined && acc.accountType == 'ACCOUNT') {
                if (accountSession.parentHead == 1 || accountSession.parentHead == 2) {
                    customAccount['disabled'] = true;
                }
                else if (accountSession.balance == nextSessionAccount.openingBalance) { // what is checked here?
                    accountSession['disabled'] = true;
                }
            }
            else if (nextSessionAccount != undefined && acc.accountType == 'GROUP') {
                customAccount['disabled'] = true;
            }
            this.vm.currentSessionAccountSessionList.push(customAccount);
        }
    }


    initialiseDisplayData(toPopulateAccountsSessionList, list) {
        const nonIndividualAccount = JSON.parse(JSON.stringify(
            toPopulateAccountsSessionList.filter(accountSession => accountSession.parentGroup
                && accountSession.type == 'ACCOUNT')));
        const individualAccountList = JSON.parse(JSON.stringify(
            toPopulateAccountsSessionList.filter(accountSession => !accountSession.parentGroup
                && accountSession.type == 'ACCOUNT')));
        const groupStructureList = JSON.parse(JSON.stringify(
            toPopulateAccountsSessionList.filter(accountSession => accountSession.type == 'GROUP'))).map(group => {
                return { ...group, childs: [] }; // structure of group
            });

        nonIndividualAccount.forEach(accountSession => {    // pushing all accounts with parentGroup in child of its group
            groupStructureList.find(g => g.parentAccount == accountSession.parentGroup).childs.push(accountSession);
        });

        for (let i = 0; i < groupStructureList.length; i++) {
            if (groupStructureList[i].parentGroup) {
                if (groupStructureList.find(group => group.id == groupStructureList[i].parentGroup) == undefined)
                    groupStructureList.find(group => group.parentAccount == groupStructureList[i].parentGroup).childs.push(groupStructureList[i]);
            }
        }
        const rootGroupStructureList = groupStructureList.filter(group => !group.parentGroup);
        this.populateHeadWiseDisplayList(rootGroupStructureList, individualAccountList, list);

    }

    populateHeadWiseDisplayList(groupsList, individualAccountList, list) {

        list['Expenses'] = [];
        list['Income'] = [];
        list['Assets'] = [];
        list['Liabilities'] = [];

        groupsList.forEach(group => {
            let head = this.vm.headsList.find(head => head.id == group.parentHead).title;
            list[head].push(group);
        });
        individualAccountList.forEach(account => {
            let head = this.vm.headsList.find(head => head.id == account.parentHead).title;
            list[head].push(account);
        });
    }

    transferAccounts() {
        this.vm.isLoading = true;
        let toCreateList = [];
        let toUpdateList = [];
        this.vm.currentSessionAccountSessionList.forEach(element => {
            if (element.selected) {
                let nextSessionAccount = this.vm.nextSessionAccountSessionList.find(acc => acc.parentAccount == element.parentAccount);
                if (nextSessionAccount == undefined) {
                    let temp_data = {
                        parentAccount: element.parentAccount,
                        parentGroup: element.parentGroup,
                        parentHead: element.parentHead,
                        parentSession: this.vm.nextSession.id,
                        openingBalance: 0,
                    };
                    if (element.type == 'ACCOUNT') {
                        if (element.parentHead == 1 || element.parentHead == 2) {
                            temp_data.openingBalance = 0;
                        }
                        else if (element.parentHead == 3 || element.parentHead == 4) {
                            temp_data.openingBalance = element.currentBalance;
                        }
                    }
                    toCreateList.push(temp_data);
                }
                else {
                    if (!element.disabled) {
                        let temp_data = {
                            id: nextSessionAccount.id,
                            openingBalance: element.currentBalance,
                        };
                        toUpdateList.push(temp_data);
                    }
                }

            }

        });
        Promise.all([
            this.vm.accountsService.createObjectList(this.vm.accountsService.account_session, toCreateList),
            this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.account_session, toUpdateList),
        ]).then(val => {
            this.populateNextSessionAccountSessionList([...this.vm.nextSessionAccountSessionList, ...val[0]]);

            val[1].forEach(accountSession => {
                const accountSessionRef = this.vm.nextSessionAccountSessionList.find(acc => acc.id == accountSession.id);

                // curent blance += diff in opening balance
                accountSessionRef.currentBalance += accountSession.openingBalance - accountSessionRef.openingBalance;
                accountSessionRef.openingBalance = accountSession.openingBalance;
            });

            this.populateNextSessionAccountSessionList(this.vm.nextSessionAccountSessionList);
            this.populateCurrentSessionAccountSessionList(this.vm.currentSessionAccountSessionList);
            this.initialiseDisplayData(this.vm.currentSessionAccountSessionList, this.vm.currentSessionHierarchyStructure);
            this.initialiseDisplayData(this.vm.nextSessionAccountSessionList, this.vm.nextSessionHierarchyStructure);
            this.vm.deSelectAllAccounts();
            alert('Balance Transferred Successfully');
            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }


}