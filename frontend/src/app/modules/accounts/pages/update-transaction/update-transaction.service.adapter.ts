import { UpdateTransactionComponent } from './update-transaction.component';

export class UpdateTransactionServiceAdapter {

    vm: UpdateTransactionComponent;
    constructor() { }
    // Data

    transaction_id_list = [];

    initializeAdapter(vm: UpdateTransactionComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoadingTransaction = false;
        this.vm.isLoading = true;

        let lock_accounts_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };
        this.vm.accountsService.getObjectList(this.vm.accountsService.lock_accounts, lock_accounts_data).then(value => {
            if (value.length == 1) {
                this.vm.lockAccounts = value[0];
                this.vm.isLoading = false;
            } else if (value.length == 0) {
                this.vm.transactionsList = [];
                this.vm.maximumPermittedAmount = null;
                let request_account_session_data = {
                    parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                    parentAccount__accountType: 'ACCOUNT',
                };

                let employee_data = {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                };

                let request_account_title_data = {
                    parentSchool: this.vm.user.activeSchool.dbId,
                    accountType: 'ACCOUNT',
                };

                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),
                    this.vm.genericService.getObjectList({school_app: 'Session'}, {}),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_title_data),
                ]).then(value => {
                    if (value[2].length > 0) {
                        this.vm.maximumPermittedAmount = value[2][0].restrictedAmount;
                    }
                    // change for current session
                    this.vm.minimumDate = value[1].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).startDate;
                    this.vm.maximumDate = value[1].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).endDate;
                    this.vm.accountsList = value[0];
                    this.populateAccountTitle(value[3]);
                    this.vm.isLoading = false;
                });
            }
            else {
                this.vm.isLoading = false;
                alert("Unexpected errors. Please contact admin");
            }
        }, error => {
            this.vm.isLoading = false;
        });
    }

    populateAccountTitle(accountTitleList) {
        this.vm.accountsList.forEach(acc => {
            acc['title'] = accountTitleList.find(account => account.id == acc.parentAccount).title;
        });
    }

    findTransactionByVNumber(vNumber: any) {
        if (this.vm.isLoadingTransaction) {
            return;
        }
        this.vm.transactionsList = [];
        if (!/^[0-9]+$/.test(vNumber)) {
            alert("Please use a valid Voucher Number.");
            return;
        }
        this.vm.isLoadingTransaction = true;
        let data = {
            voucherNumber: vNumber,
            transactionDate__gte: this.vm.minimumDate,
            transactionDate__lte: this.vm.maximumDate,
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, data),
        ]).then(val => {
            if (val[0].length > 0) {
                let transaction_data = {
                    parentTransaction: val[0][0].id,
                };
                const serviceList = [
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_data),
                ];
                Promise.all(serviceList).then(data => {
                    this.initialiseTransactionData(val[0], data[0], data[1]);
                    this.vm.isLoadingTransaction = false;
                });
                this.vm.shouldTransactionsBeEmpty = false;
            }
            else {
                this.vm.isLoadingTransaction = false;
                this.vm.loadMoreTransaction = false;
                this.vm.shouldTransactionsBeEmpty = true;
            }
        });
    }

    findTransactionByAccount(account: any) {
        this.vm.transactionsList = [];
        this.vm.loadMoreTransaction = true;
        this.vm.isLoadingTransaction = true;
        this.transaction_id_list = [];
        let data = {
            parentAccount: account.parentAccount,
            parentTransaction__transactionDate__gte: this.vm.minimumDate,
            parentTransaction__transactionDate__lte: this.vm.maximumDate,
            fields__korangle: 'parentTransaction',
            korangle__order: '-parentTransaction'
        };

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, data),
        ]).then(value => {
            value[0].forEach(ele => {
                this.transaction_id_list.push(ele.parentTransaction);
            });
            this.transaction_id_list = this.transaction_id_list.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });

            let min = Math.min(this.vm.loadingCount, this.transaction_id_list.length);
            if (min < this.vm.loadingCount) {
                this.vm.loadMoreTransaction = false;
            }

            let transaction_id_list = [];
            for (let i = 0; i < min; i++) {
                transaction_id_list.push(this.transaction_id_list[0]);
                this.transaction_id_list.splice(0, 1);
            }
            let data = {
                id__in: transaction_id_list,
            };

            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, data),
            ]).then(val => {
                if (val[0].length > 0) {

                    let transaction_data = {
                        parentTransaction__in: transaction_id_list,
                    };
                    Promise.all([
                        this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_data),
                        this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_data),
                    ]).then(data => {
                        this.initialiseTransactionData(val[0], data[0], data[1]);
                        this.vm.shouldTransactionsBeEmpty = false;
                        this.vm.isLoadingTransaction = false;
                    });
                }
                else {
                    this.vm.isLoadingTransaction = false;
                    this.vm.shouldTransactionsBeEmpty = true;
                }
            });
        });
    }

    loadMoreTransaction() {
        this.vm.isLoadingTransaction = true;
        let min = Math.min(this.vm.loadingCount, this.transaction_id_list.length);
        if (min < this.vm.loadingCount) {
            this.vm.loadMoreTransaction = false;
        }

        let transaction_id_list = [];
        for (let i = 0; i < min; i++) {
            transaction_id_list.push(this.transaction_id_list[0]);
            this.transaction_id_list.splice(0, 1);
        }
        let data = {
            id__in: transaction_id_list,
        };
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, data),
        ]).then(val => {
            if (val[0].length > 0) {

                let transaction_data = {
                    parentTransaction__in: transaction_id_list,
                };
                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_data),
                ]).then(data => {
                    this.initialiseTransactionData(val[0], data[0], data[1]);
                    this.vm.isLoadingTransaction = false;
                });
            }
            else {
                this.vm.isLoadingTransaction = false;
            }
        });

    }

    initialiseTransactionData(transactionList, transactionAccounts, transactionImages) {
        transactionList.forEach(transaction => {
            let tempData = {
                dbId: transaction.id,
                debitAccounts: [],
                creditAccounts: [],
                remark: transaction.remark,
                billImages: [],
                quotationImages: [],
                approvalId: transaction.approvalId,
                voucherNumber: transaction.voucherNumber,
                transactionDate: transaction.transactionDate,
            };

            transactionAccounts.forEach(account => {
                if (account.parentTransaction == transaction.id) {
                    let tempAccount = this.vm.accountsList.find(acccount => acccount.parentAccount == account.parentAccount);
                    let temp = {
                        dbId: tempAccount.id,
                        accountDbId: tempAccount.parentAccount,
                        account: tempAccount.title,
                        amount: account.amount,
                        transactionAccountDbId: account.id,
                        balance: tempAccount.balance,
                    };
                    if (account.transactionType == 'DEBIT') {
                        tempData.debitAccounts.push(temp);
                    }
                    else {
                        tempData.creditAccounts.push(temp);
                    }
                }
            });
            transactionImages.forEach(image => {
                if (image.parentTransaction == transaction.id) {
                    if (image.imageType == 'BILL') {
                        tempData.billImages.push(image);
                    }
                    else {
                        tempData.quotationImages.push(image);
                    }
                }
            });
            tempData.billImages.sort((a, b) => { return (a.orderNumber - b.orderNumber); });
            tempData.quotationImages.sort((a, b) => { return (a.orderNumber - b.orderNumber); });
            this.vm.transactionsList.push(tempData);

        });
        this.vm.transactionsList.sort((a, b) => { return (b.voucherNumber - a.voucherNumber); });
    }

    deleteTransaction(transaction) {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }
        this.vm.isLoading = true;
        let transaction_data = {
            id: transaction.dbId,
        };
        Promise.all([
            this.vm.accountsService.deleteObject(this.vm.accountsService.transaction, transaction_data),
        ]).then(val => {
            const transactionIndex = this.vm.transactionsList.findIndex(t => t.dbId == transaction_data.id);
            this.vm.transactionsList.splice(transactionIndex, 1);
            alert('Transaction Deleted Successfully');
            this.vm.isLoading = false;
        });
    }

}
