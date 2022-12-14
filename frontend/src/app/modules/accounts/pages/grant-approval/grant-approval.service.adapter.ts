import { GrantApprovalComponent } from './grant-approval.component';
import { CommonFunctions } from './../../../../classes/common-functions';

export class GrantApprovalServiceAdapter {

    vm: GrantApprovalComponent;

    initialiseAdapter(vm: GrantApprovalComponent) {
        this.vm = vm;
    }

    async initialiseData() {
        this.vm.isLoading = true;

        let request_account_title_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_account_session_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentAccount__accountType: 'ACCOUNT',
        };

        let employee_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let lock_accounts_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        const currentSession =
            (await this.vm.genericService.getObjectList({school_app: 'Session'}, {}))
                .find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
        this.vm.minimumDate = currentSession.startDate;
        this.vm.maximumDate = currentSession.endDate;
        this.vm.approvalsList = [];
        const approval_request_data = {
            'parentEmployeeRequestedBy__parentSchool': this.vm.user.activeSchool.dbId,
            'requestedGenerationDateTime__gte': this.vm.minimumDate,
            'requestedGenerationDateTime__lte': this.vm.maximumDate,
            'korangle__order': '-id',
            'korangle__count': this.vm.approvalsList.length.toString() + ',' + this.vm.loadingCount.toString(),
        };

        this.vm.accountsService.getObjectList(this.vm.accountsService.lock_accounts, lock_accounts_data).then(value => {
            if (value.length == 1) {
                this.vm.lockAccounts = value[0];
                this.vm.isLoading = false;
            } else if (value.length == 0) {
                this.vm.loadMoreApprovals = true;

                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),   // 0
                    this.vm.genericService.getObjectList({employee_app: 'Employee'}, {filter: employee_data}), // 1
                    this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_title_data),    // 3
                    this.vm.accountsService.getObjectList(this.vm.accountsService.approval, approval_request_data), //4
                ]).then(value => {
                    this.vm.accountsList = value[0];
                    this.populateAccountTitle(value[2]);
                    this.vm.employeeList = value[1];

                    const approval_id = [];

                    value[3].forEach(approval => {
                        approval_id.push(approval.id);
                    });
                    let approval_details_data = {
                        'parentApproval__in': approval_id,
                    };
                    Promise.all([
                        this.vm.accountsService.getObjectList(this.vm.accountsService.approval_account_details, approval_details_data), // 0
                        this.vm.accountsService.getObjectList(this.vm.accountsService.approval_images, approval_details_data),  // 1
                    ]).then(data => {
                        // val[0]: approval_list, data[0]: approval_account_details_list, data[1]: approval_images_list
                        this.initialiseApprovalData(value[3], data[0], data[1]);
                        if (value[3].length < this.vm.loadingCount) {
                            this.vm.loadMoreApprovals = false;
                        }
                        this.vm.isLoading = false;
                    });

                });
            }
            else {
                this.vm.isLoadingApproval = false;
                this.vm.isLoading = false;
                alert("Unexpected errors. Please contact admin");
            }
        });
    }

    populateAccountTitle(accountTitleList) {
        this.vm.accountsList.forEach(acc => {
            acc['title'] = accountTitleList.find(account => account.id == acc.parentAccount).title;
        });
    }

    loadMoreApprovals() {
        this.vm.isLoadingApproval = true;

        let approval_request_data = {
            parentEmployeeRequestedBy__parentSchool: this.vm.user.activeSchool.dbId,
            'requestedGenerationDateTime__gte': this.vm.minimumDate,
            'requestedGenerationDateTime__lte': this.vm.maximumDate,
            'korangle__order': '-id',
            'korangle__count': this.vm.approvalsList.length.toString() + ',' + (this.vm.approvalsList.length + this.vm.loadingCount).toString(),
        };
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.approval, approval_request_data),
        ]).then(value => {
            let approval_id = [];
            value[0].forEach(approval => {
                approval_id.push(approval.id);
            });
            let approval_details_data = {
                'parentApproval__in': approval_id,
            };
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval_account_details, approval_details_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval_images, approval_details_data),
            ]).then(data => {
                this.initialiseApprovalData(value[0], data[0], data[1]);
                this.vm.isLoadingApproval = false;

                if (value[0].length < this.vm.loadingCount) {
                    this.vm.loadMoreApprovals = false;
                }
            });
        });

    }

    initialiseApprovalData(approvalList, approvalAccounts, approvalImages) {
        approvalList.forEach(approval => {
            let tempData = {
                dbId: approval.id,
                debitAccounts: [],
                creditAccounts: [],
                remark: approval.remark,
                billImages: [],
                quotationImages: [],
                approvalId: approval.approvalId,
                requestedGenerationDateTime: approval.requestedGenerationDateTime,
                approvedGenerationDateTime: approval.approvedGenerationDateTime,
                requestedBy: approval.parentEmployeeRequestedBy,
                approvedBy: approval.parentEmployeeApprovedBy,
                requestedByName: null,
                approvedByName: null,
                requestStatus: approval.requestStatus,
                parentTransaction: approval.parentTransaction,
                transactionDate: approval.transactionDate,
                autoAdd: approval.autoAdd,
            };

            tempData.requestedByName = this.vm.employeeList.find(employee => employee.id == tempData.requestedBy).name;
            if (tempData.approvedBy != null)
                tempData.approvedByName = this.vm.employeeList.find(employee => employee.id == tempData.approvedBy).name;

            approvalAccounts.forEach(account => {
                if (account.parentApproval == approval.id) {
                    let tempAccount = this.vm.accountsList.find(acccount => acccount.parentAccount == account.parentAccount);
                    let temp = {
                        dbId: tempAccount.id,
                        accountDbId: tempAccount.parentAccount,
                        account: tempAccount.title,
                        amount: account.amount,
                        balance: tempAccount.balance,
                        parentHead: tempAccount.parentHead,
                        parentGroup: tempAccount.parentGroup,
                    };
                    if (account.transactionType == 'DEBIT') {
                        tempData.debitAccounts.push(temp);
                    }
                    else {
                        tempData.creditAccounts.push(temp);
                    }
                }
            });

            approvalImages.forEach(image => {
                if (image.parentApproval == approval.id) {
                    if (approval.parentTransaction == null && approval.autoAdd) {
                        this.getBase64FromUrl(image.imageURL).then(data64URL => {
                            image.imageURL = data64URL;
                        });
                    }
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
            this.vm.approvalsList.push(tempData);

        });
        this.vm.approvalsList.sort((a, b) => { return (b.approvalId - a.approvalId); });
    }

    async changeApprovalStatus(approval, status) {
        this.vm.isLoading = true;
        approval.requestStatus = status;
        let tempData = {
            id: approval.dbId,
            requestStatus: approval.requestStatus,
            parentEmployeeApprovedBy: this.vm.user.activeSchool.employeeId,
            approvedGenerationDateTime: CommonFunctions.formatDate(new Date(), ''),
        };
        Promise.all([
            this.vm.accountsService.partiallyUpdateObject(this.vm.accountsService.approval, tempData),
        ]).then(value => {
            approval.parentEmployeeApprovedBy = this.vm.user.activeSchool.employeeId;
            approval.approvedGenerationDateTime = value[0].approvedGenerationDateTime;

            if (approval.autoAdd && status == 'APPROVED') {
                let transaction_data = {
                    parentSchool: this.vm.user.activeSchool.dbId,
                    parentEmployee: approval.requestedBy,
                    remark: approval.remark,
                    transactionDate: approval.transactionDate ? approval.transactionDate : CommonFunctions.formatDate(new Date(), ''),
                    approvalId: approval.approvalId,
                };
                Promise.all([
                    this.vm.accountsService.createObject(this.vm.accountsService.transaction, transaction_data),
                ]).then(value1 => {
                    let toCreateAccountList = [];
                    const service = [];

                    // value[0].forEach((element,index) =>{
                    approval.debitAccounts.forEach(account => {
                        let tempData = {
                            parentTransaction: value1[0].id,
                            parentAccount: account.accountDbId,
                            amount: account.amount,
                            transactionType: 'DEBIT',
                        };
                        toCreateAccountList.push(tempData);
                    });
                    approval.creditAccounts.forEach(account => {
                        let tempData = {
                            parentTransaction: value1[0].id,
                            parentAccount: account.accountDbId,
                            amount: account.amount,
                            transactionType: 'CREDIT',
                        };
                        toCreateAccountList.push(tempData);
                    });


                    let i = 1;

                    i = 1;
                    approval.billImages.forEach(image => {
                        let tempData = {
                            parentTransaction: value1[0].id,
                            imageURL: image.imageURL,
                            orderNumber: i,
                            imageType: 'BILL',
                        };
                        let temp_form_data = new FormData();
                        const layout_data = { ...tempData, };
                        Object.keys(layout_data).forEach(key => {
                            if (key === 'imageURL') {
                                temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i + '.jpeg'));
                            } else {
                                temp_form_data.append(key, layout_data[key]);
                            }
                        });
                        i = i + 1;
                        service.push(this.vm.accountsService.createObject(this.vm.accountsService.transaction_images, temp_form_data));
                    });

                    i = 1;
                    approval.quotationImages.forEach(image => {
                        let tempData = {
                            parentTransaction: value1[0].id,
                            imageURL: image.imageURL,
                            orderNumber: i,
                            imageType: 'QUOTATION',
                        };
                        let temp_form_data = new FormData();
                        const layout_data = { ...tempData, };
                        Object.keys(layout_data).forEach(key => {
                            if (key === 'imageURL') {
                                temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i + '.jpeg'));
                            } else {
                                temp_form_data.append(key, layout_data[key]);
                            }
                        });
                        i = i + 1;
                        service.push(this.vm.accountsService.createObject(this.vm.accountsService.transaction_images, temp_form_data));
                    });
                    service.push(this.vm.accountsService.createObjectList(this.vm.accountsService.transaction_account_details, toCreateAccountList));


                    approval.parentTransaction = value1[0].id;
                    approval.transactionDate = value[0].transactionDate;

                    Promise.all(service).then(data => {
                        this.vm.isLoading = false;
                        alert('Request Status Changed Successfully');
                    });
                });
            }
            else {
                this.vm.isLoading = false;
                alert('Request Status Changed Successfully');
            }
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

