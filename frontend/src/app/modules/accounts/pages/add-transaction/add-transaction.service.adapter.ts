import { AddTransactionComponent } from './add-transaction.component';
import { CommonFunctions } from './../../../../classes/common-functions';

export class AddTransactionServiceAdapter {

    vm: AddTransactionComponent;
    constructor() { }
    // Data

    initializeAdapter(vm: AddTransactionComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
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
                this.vm.lockAccounts = null;
                this.vm.backendData.approvalList = [];

                let request_account_title_data = {
                    parentSchool: this.vm.user.activeSchool.dbId,
                    accountType: 'ACCOUNT',
                };

                let request_account_data = {
                    parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
                    parentAccount__accountType: 'ACCOUNT',
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                };

                let employee_data = {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                };

                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_data),
                    this.vm.genericService.getObjectList({school_app: 'Session'}, {}),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_title_data),
                ]).then(value => {
                    // change for current session
                    this.vm.htmlRenderer.minimumDate = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).startDate;
                    this.vm.htmlRenderer.maximumDate = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).endDate;
                    this.vm.initilizeDate();

                    this.vm.backendData.accountSessionList = value[0];
                    this.vm.backendData.accountList = value[3].filter(account =>
                        this.vm.backendData.accountSessionList.find(accountSession =>
                            accountSession.parentAccount == account.id) != undefined); // only accounts of currentSession
                    if (value[1].length > 0) {
                        this.vm.maximumPermittedAmount = value[1][0].restrictedAmount;
                    }
                    else {
                        this.vm.maximumPermittedAmount = null;
                    }

                    let granted_approval_data = {
                        'parentEmployeeRequestedBy': this.vm.user.activeSchool.employeeId,
                        'requestStatus': 'APPROVED',
                        'parentTransaction': 'null__korangle',
                        'requestedGenerationDateTime__gte': this.vm.htmlRenderer.minimumDate,
                        'requestedGenerationDateTime__lte': this.vm.htmlRenderer.maximumDate,
                    };

                    let approval_account_details = {
                        'parentApproval__parentEmployeeRequestedBy': this.vm.user.activeSchool.employeeId,
                        'parentApproval__requestStatus': 'APPROVED',
                        'parentApproval__parentTransaction': 'null__korangle',
                        'parentApproval__requestedGenerationDateTime__gte': this.vm.htmlRenderer.minimumDate,
                        'parentApproval__requestedGenerationDateTime__lte': this.vm.htmlRenderer.maximumDate,
                    };

                    let approval_images = {
                        'parentApproval__parentEmployeeRequestedBy': this.vm.user.activeSchool.employeeId,
                        'parentApproval__requestStatus': 'APPROVED',
                        'parentApproval__parentTransaction': 'null__korangle',
                        'parentApproval__requestedGenerationDateTime__gte': this.vm.htmlRenderer.minimumDate,
                        'parentApproval__requestedGenerationDateTime__lte': this.vm.htmlRenderer.maximumDate,
                    };

                    Promise.all([
                        this.vm.accountsService.getObjectList(this.vm.accountsService.approval, granted_approval_data),
                        this.vm.accountsService.getObjectList(this.vm.accountsService.approval_account_details, approval_account_details),
                        this.vm.accountsService.getObjectList(this.vm.accountsService.approval_images, approval_images),
                    ]).then(val => {

                        this.vm.backendData.approvalList = val[0];
                        this.vm.backendData.approvalAccountDetailsList = val[1];
                        this.vm.backendData.approvalImagesList = val[2];

                        this.vm.isLoading = false;

                    });

                });
            } else {
                this.vm.isLoading = false;
                alert("Unexpected errors. Please contact admin");
            }
        });
    }

    addTransactions(): any {

        this.vm.isLoading = true;

        let toCreateTransactionList = [];
        this.vm.transactionList.forEach(transaction => {
            let tempData: { [key: string]: any; } = {
                parentEmployee: this.vm.user.activeSchool.employeeId,
                parentSchool: this.vm.user.activeSchool.dbId,
                remark: transaction.remark,
                transactionDate: this.vm.selectedDate,
            };
            if (transaction.approval) {
                tempData.approvalId = transaction.approval.approvalId;
            }
            toCreateTransactionList.push(tempData);
        });

        Promise.all([
            this.vm.accountsService.createObjectList(this.vm.accountsService.transaction, toCreateTransactionList),
        ]).then(value => {

            let toCreateTransactionAccountDetailsList = [];
            const serviceList = [];

            value[0].forEach((element, index) => {

                let transaction = this.vm.transactionList[index];

                // Debit Accounts
                transaction.debitAccountList.forEach(account => {
                    let tempData = {
                        parentTransaction: element.id,
                        ...account,
                        transactionType: 'DEBIT',
                    };
                    toCreateTransactionAccountDetailsList.push(tempData);
                });

                // Credit Accounts
                transaction.creditAccountList.forEach(account => {
                    let tempData = {
                        parentTransaction: element.id,
                        ...account,
                        transactionType: 'CREDIT',
                    };
                    toCreateTransactionAccountDetailsList.push(tempData);
                });

                // Bill Images
                let i = 1;
                this.vm.transactionList[index].billImages.forEach(image => {
                    let temp_form_data = new FormData();
                    temp_form_data.append('parentTransaction', element.id);
                    temp_form_data.append('imageURL', CommonFunctions.dataURLtoFile(image.imageURL, 'imageURL' + i + '.jpeg'));
                    temp_form_data.append('orderNumber', i.toString());
                    temp_form_data.append('imageType', 'BILL');
                    i = i + 1;
                    // toCreateTransactionImageList.push(temp_form_data);
                    serviceList.push(this.vm.accountsService.createObject(this.vm.accountsService.transaction_images, temp_form_data));
                });

                // Quotation Images
                i = 1;
                this.vm.transactionList[index].quotationImages.forEach(image => {
                    let temp_form_data = new FormData();
                    temp_form_data.append('parentTransaction', element.id);
                    temp_form_data.append('imageURL', CommonFunctions.dataURLtoFile(image.imageURL, 'imageURL' + i + '.jpeg'));
                    temp_form_data.append('orderNumber', i.toString());
                    temp_form_data.append('imageType', 'QUOTATION');
                    i = i + 1;
                    // toCreateTransactionImageList.push(temp_form_data);
                    serviceList.push(this.vm.accountsService.createObject(this.vm.accountsService.transaction_images, temp_form_data));
                });

            });


            serviceList.push(this.vm.accountsService.createObjectList(
                this.vm.accountsService.transaction_account_details,
                toCreateTransactionAccountDetailsList));
            /*if (toCreateTransactionImageList.length > 0) {
                serviceList.push(this.vm.accountsService.createObjectList(this.vm.accountsService.transaction_images, toCreateTransactionImageList));
            }*/

            Promise.all(serviceList).then(data => {

                this.vm.backendData.approvalList = this.vm.backendData.approvalList.filter(approval => {
                    return this.vm.transactionList.find(transaction => transaction.approval && transaction.approval.id == approval.id) == undefined;
                });

                this.vm.transactionList = [];
                this.vm.htmlRenderer.addNewTransaction();

                // Write down the number of transactions that have been recorded in alert message.
                alert(toCreateTransactionList.length + ' Transaction/s Recorded Successfully');

                this.vm.isLoading = false;
            });

        });

    }

    getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                const base64data = reader.result;
                resolve(base64data);
            };
        });
    }

}
