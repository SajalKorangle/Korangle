import { ViewBalanceComponent } from './view-balance.component';
import { Account } from '@services/modules/accounts/models/account';
import { AccountSession } from '@services/modules/accounts/models/account-session';
export class ViewBalanceServiceAdapter {

    vm: ViewBalanceComponent;
    constructor() { }
    // Data

    initializeAdapter(vm: ViewBalanceComponent): void {
        this.vm = vm;
    }

    accountsSessionList: Array<AccountSession>;
    accountsList: Array<Account>;

    //initialize data
    async initializeData() {
        let request_account_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        this.vm.isLoading = true;
        let employee_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };
        let lock_accounts_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        const request_account_session_data = {
            'parentAccount__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        const value = await Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),  // 0
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 1
            this.vm.genericService.getObjectList({employee_app: 'Employee'}, {filter: employee_data}), // 2
            this.vm.accountsService.getObjectList(this.vm.accountsService.lock_accounts, lock_accounts_data),   // 3
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data), // 4
        ]);
        this.initialiseLockAccountData(value[3]);

        this.vm.employeeList = value[2];
        const currentSesion = value[1].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
        this.vm.minimumDate = currentSesion.startDate;  // change for current session
        this.vm.maximumDate = currentSesion.endDate;

        this.accountsList = value[0];
        this.accountsSessionList = value[4].map(acc => {
            return { ...acc, currentBalance: parseFloat(acc.currentBalance) };
        });
        this.initialiseAccountGroupList();
        this.initialiseDisplayData();
        this.vm.isLoading = false;
    }

    initialiseLockAccountData(value) {
        if (value.length == 0) {
            this.vm.lockAccounts = null;
        } else if (value.length == 1) {
            this.vm.lockAccounts = value[0];
        }
        else {
            alert("Unexpected errors. Please contact admin");
        }
    }

    initialiseAccountGroupList() {
        this.vm.accountsList = [];
        this.vm.groupsList = [];
        this.accountsSessionList.forEach(accountSession => {
            let acc = this.accountsList.find(accounts => accounts.id == accountSession.parentAccount);
            const customAccount = { ...accountSession, type: acc.accountType, title: acc.title };
            if (acc.accountType == 'ACCOUNT') {
                this.vm.accountsList.push(customAccount);
            }
            else {
                this.vm.groupsList.push(customAccount);
            }
        });
        return;
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
        rootGroupStructureList.forEach(g => {
            this.populateGroupBalance(g);
        });
        this.populateHeadWiseDisplayList(rootGroupStructureList, individualAccountList);
    }

    populateGroupBalance(customGroup): number {
        if (customGroup.type == 'ACCOUNT') {
            return customGroup.currentBalance;
        }
        if (customGroup.type == 'GROUP' && customGroup.childs.length == 0) {
            customGroup.currentBalance = 0;
            return 0;
        }
        customGroup.currentBalance = customGroup.childs.reduce((acc, nextEl) => acc + this.populateGroupBalance(nextEl), 0);
        return customGroup.currentBalance;
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

    loadTransactions() {
        this.vm.transactionsList = [];
        let data = {
            parentAccount: this.vm.ledgerAccount.parentAccount,
            parentTransaction__transactionDate__lte: this.vm.maximumDate,
            parentTransaction__transactionDate__gte: this.vm.minimumDate,
            fields__korangle: 'parentTransaction',
        };
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, data),
        ]).then(val => {
            let transction_id_list = [];
            val[0].forEach(element => {
                transction_id_list.push(element.parentTransaction);
            });
            let transaction_data = {
                id__in: transction_id_list,
            };
            let transaction_details_data = {
                parentTransaction__in: transction_id_list,
            };
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, transaction_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_details_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_details_data),
            ]).then(data => {
                this.initialiseTransactionData(data[0], data[1].map(el => {
                    return { ...el, amount: parseFloat(el.amount) };
                }), data[2]);
                this.vm.isLedgerLoading = false;
            });
        });
    }

    initialiseTransactionData(transactionList, transactionAccounts, transactionImages) {
        transactionList.sort((a, b) => {
            return b.voucherNumber - a.voucherNumber;
        });
        let lastAccountBalance = this.vm.ledgerAccount.currentBalance;
        for (let j = 0; j < transactionList.length; j++) {
            let transaction = transactionList[j];
            let totalAmount = 0;
            let ledgerAccountAmount;
            let ledgerAccountType;

            let tempData = {
                dbId: transaction.id,
                debitAccounts: [],
                creditAccounts: [],
                accounts: [],
                remark: transaction.remark,
                billImages: [],
                quotationImages: [],
                approvalId: transaction.approvalId,
                voucherNumber: transaction.voucherNumber,
                transactionDate: transaction.transactionDate,
                parentEmployeeName: null,
                parentEmployee: transaction.parentEmployee,
                balance: -1,
            };

            tempData.parentEmployeeName = this.vm.employeeList.find(employee => employee.id == transaction.parentEmployee).name;

            for (let i = 0; i < transactionAccounts.length; i++) {
                let account = transactionAccounts[i];
                if (account.parentTransaction == transaction.id) {
                    let tempAccount = this.vm.accountsList.find(acc => acc.parentAccount == account.parentAccount);
                    if (tempAccount.parentAccount == this.vm.ledgerAccount.parentAccount) {
                        ledgerAccountAmount = account.amount;
                        ledgerAccountType = account.transactionType;
                    }
                    let temp = {
                        dbId: tempAccount.id,
                        accountDbId: tempAccount.parentAccount,
                        account: tempAccount.title,
                        amount: account.amount,
                        transactionAccountDbId: account.id,
                        parentHead: tempAccount.parentHead,
                        parentGroup: tempAccount.parentGroup,
                    };
                    if (account.transactionType == 'DEBIT') {
                        tempData.debitAccounts.push(temp);
                        totalAmount += account.amount;
                    }
                    else {
                        tempData.creditAccounts.push(temp);
                    }
                    let temp_data = {
                        accountTitle: tempAccount.title,
                        amount: account.amount,
                        type: account.transactionType,
                    };
                    tempData.accounts.push(temp_data);
                }
            }
            tempData.balance = lastAccountBalance;
            if (ledgerAccountType == 'DEBIT') {
                lastAccountBalance = lastAccountBalance - ledgerAccountAmount;
            } else {
                lastAccountBalance = lastAccountBalance + ledgerAccountAmount;
            }

            for (let i = 0; i < tempData.accounts.length; i++) {
                let account = tempData.accounts[i];
                if (ledgerAccountType == account.type) {
                    tempData.accounts.splice(i, 1);
                    i--;
                }
                else {
                    account.amount = (account.amount * ledgerAccountAmount) / totalAmount;
                }
            }

            for (let i = 0; i < transactionImages.length; i++) {
                let image = transactionImages[i];
                if (image.parentTransaction == transaction.id) {
                    if (image.imageType == 'BILL') {
                        tempData.billImages.push(image);
                    }
                    else {
                        tempData.quotationImages.push(image);
                    }
                    transactionImages.splice(i, 1);
                    i--;
                }

            }
            tempData.billImages.sort((a, b) => { return (a.orderNumber - b.orderNumber); });
            tempData.quotationImages.sort((a, b) => { return (a.orderNumber - b.orderNumber); });

            this.vm.transactionsList.push(tempData);
        }
    }

}
