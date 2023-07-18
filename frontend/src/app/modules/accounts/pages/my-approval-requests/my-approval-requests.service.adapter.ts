import { MyApprovalRequestsComponent } from './my-approval-requests.component';
import { CommonFunctions } from './../../../../classes/common-functions';
export class MyApprovalRequestsServiceAdapter {

    vm : MyApprovalRequestsComponent;

    initialiseAdapter(vm: MyApprovalRequestsComponent) {
        this.vm = vm;
    }

    initialiseData() {

        this.vm.isLoading = true;

        const request_account_session_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentAccount__accountType: 'ACCOUNT',
        };

        const request_account_title_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            accountType: 'ACCOUNT',
        };

        const employee_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            // resterict to required fields only
        };

        const lock_account_request = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),   // 0
            this.vm.genericService.getObjectList({employee_app: 'Employee'}, {filter: employee_data}), // 2
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 2
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_title_data),    // 3
            this.vm.accountsService.getObjectList(this.vm.accountsService.lock_accounts, lock_account_request), // 4
        ]).then(value => {
            this.vm.accountsList = value[0];
            this.vm.employeeList = value[1];

            const currentSession = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
            this.vm.minimumDate = currentSession.startDate;  // change for current session
            this.vm.maximumDate = currentSession.endDate;

            this.populateAccountTitle(value[3]);

            if (value[4].length > 0) {
                this.vm.accountsLockedForSession = true;
            }

            let approval_id = [];
            let approval_request_data = {
                'parentEmployeeRequestedBy': this.vm.user.activeSchool.employeeId,
                'requestedGenerationDateTime__gte': this.vm.minimumDate,
                'requestedGenerationDateTime__lte': this.vm.maximumDate,
                'korangle__order': '-id',
                'korangle__count': '0,10'
            };
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval, approval_request_data),
            ]).then(val => {
                val[0].forEach(approval => {
                    approval_id.push(approval.id);
                });
                if (val[0].length < 10) {
                    this.vm.moreAprovalsAvailable = false;
                }
                let approval_details_data = {
                    'parentApproval__in': approval_id,
                };
                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.approval_account_details, approval_details_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.approval_images, approval_details_data),
                ]).then(data => {
                    this.initialiseApprovalData(val[0], data[0], data[1]);
                    this.vm.isLoading = false;
                });
            });

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
            parentEmployeeRequestedBy: this.vm.user.activeSchool.employeeId,
            'requestedGenerationDateTime__gte': this.vm.minimumDate,
            'requestedGenerationDateTime__lte': this.vm.maximumDate,
            'korangle__order': '-id',
            'korangle__count': this.vm.approvalsList.length.toString() + ',' + (this.vm.approvalsList.length + this.vm.loadingCount).toString(),
        };
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.approval, approval_request_data),
        ]).then(value => {
            let approval_id = [];
            if (value[0].length < this.vm.loadingCount) {
                this.vm.moreAprovalsAvailable = false;
            }
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
            });
        });

    }

    initialiseApprovalData(approvalList, approvalAccounts, approvalImages) {
        approvalList.forEach(approval => {
            let tempData = {
                ...approval,
                dbId: approval.id,
                debitAccounts: [],
                creditAccounts: [],
                billImages: [],
                quotationImages: [],
                requestedBy: approval.parentEmployeeRequestedBy,
                approvedBy: approval.parentEmployeeApprovedBy,
                requestedByName: null,
                approvedByName: null,
            };

            tempData.requestedByName = this.vm.employeeList.find(employee => employee.id == tempData.requestedBy).name;
            if (tempData.approvedBy != null)
                tempData.approvedByName = this.vm.employeeList.find(employee => employee.id == tempData.approvedBy).name;

            approvalAccounts.forEach(account => {
                if (account.parentApproval == approval.id) {
                    let tempAccount = this.vm.accountsList.find(acc => acc.parentAccount == account.parentAccount);
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
                    if (approval.parentTransaction == null && approval.requestStatus == 'APPROVED') {                 //change implementation here
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

    requestApprovals(): any {
        this.vm.isLoading = true;

        let toCreateList = [];
        this.vm.newApprovalList.forEach(approval => {
            let tempData = {
                parentSchool: this.vm.user.activeSchool.dbId,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentEmployeeRequestedBy: approval.parentEmployeeRequestedBy,
                approvalId: 0,  // 0 is sent by deafult, managed through signal to max +1
                remark: approval.remark,
                requestedGenerationDateTime: approval.requestedGenerationDateTime,
                autoAdd: approval.autoAdd,
                requestStatus: approval.requestStatus,
                transactionDate: approval.transactionDate,
            };
            toCreateList.push(tempData);
        });
        Promise.all([
            this.vm.accountsService.createObjectList(this.vm.accountsService.approval, toCreateList),
        ]).then(value => {
            let toCreateAccountList = [];

            const services = [];
            value[0].forEach((element, index) => {
                this.vm.newApprovalList[index].payFrom.forEach(accountStructure => {
                    let tempData = {
                        parentApproval: element.id,
                        parentAccount: accountStructure.account,
                        amount: accountStructure.amount,
                        transactionType: 'CREDIT',
                    };
                    toCreateAccountList.push(tempData);
                });
                this.vm.newApprovalList[index].payTo.forEach(accountStructure => {
                    let tempData = {
                        parentApproval: element.id,
                        parentAccount: accountStructure.account,
                        amount: accountStructure.amount,
                        transactionType: 'DEBIT',
                    };
                    toCreateAccountList.push(tempData);
                });

                let i = 1;
                this.vm.newApprovalList[index].billImages.forEach(image => {
                    let tempData = {
                        parentApproval: element.id,
                        imageURL: image.imageURL,
                        orderNumber: i,
                        imageType: 'BILL',
                    };
                    let temp_form_data = new FormData();
                    const layout_data = { ...tempData, };
                    Object.keys(layout_data).forEach(key => {
                        if (key === 'imageURL' ) {
                            temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i + '.jpeg'));
                        } else {
                            temp_form_data.append(key, layout_data[key]);
                        }
                    });
                    i = i + 1;
                    services.push(this.vm.accountsService.createObject(this.vm.accountsService.approval_images, temp_form_data));

                });

                i = 1;
                this.vm.newApprovalList[index].quotationImages.forEach(image => {
                    let tempData = {
                        parentApproval: element.id,
                        imageURL: image.imageURL,
                        orderNumber: i,
                        imageType: 'QUOTATION',
                    };
                    let temp_form_data = new FormData();
                    const layout_data = { ...tempData, };
                    Object.keys(layout_data).forEach(key => {
                        if (key === 'imageURL' ) {
                            temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i + '.jpeg'));
                        } else {
                            temp_form_data.append(key, layout_data[key]);
                        }
                    });
                    i = i + 1;
                    services.push(this.vm.accountsService.createObject(this.vm.accountsService.approval_images, temp_form_data));
                });
            });
            services.push(this.vm.accountsService.createObjectList(this.vm.accountsService.approval_account_details, toCreateAccountList));
            Promise.all(services).then(data => {
                this.vm.newApprovalList = [];
                this.vm.moreApprovalsCount = 1;
                this.vm.addApprovals();
                alert('Approval Request Generated Successfully');
                this.initialiseApprovalData(value[0], data[data.length - 1], data.slice(0, -1));
                this.vm.isLoading  = false;
            });

        });

    }

    getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            const base64data = reader.result;
            resolve(base64data);
          };
        });
    }

}