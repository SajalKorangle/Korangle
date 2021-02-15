import { AddTransactionComponent } from './add-transaction.component'
import { CommonFunctions } from './../../../../classes/common-functions'

export class AddTransactionServiceAdapter {

    vm: AddTransactionComponent;
    constructor() {}
    // Data

    initializeAdapter(vm: AddTransactionComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.approvalsList = [];
        let request_account_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentAccount__accountType: 'ACCOUNT',
            parentSession: this.vm.user.activeSchool.currentSessionDbId, 
        }
        let employee_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
        }
        this.vm.isLoading = true;

        let granted_approval_data = {
            'parentEmployeeRequestedBy': this.vm.user.activeSchool.employeeId,
            'requestStatus': 'APPROVED',
            'parentTransaction': 'null__korangle',
        }

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_data),
            this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_data),
            this.vm.accountsService.getObjectList(this.vm.accountsService.approval, granted_approval_data),
        ]).then(value =>{
            console.log(value);
            this.vm.accountsList = value[0];
            if(value[1].length > 0){
                this.vm.maximumPermittedAmount = value[1][0].restrictedAmount;
            }
            else{
                this.vm.maximumPermittedAmount = null;
            }
            let approval_id = [];
            value[2].forEach(approval =>{
                if(approval.parentTransaction == null){
                    approval_id.push(approval.id);
                }
            })
            let approval_details_data = {
                'parentApproval__in': approval_id,
            }
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval_request_account_details, approval_details_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval_request_images, approval_details_data),
            ]).then(data =>{
                console.log(data);
                this.initialiseApprovalData(value[2], data[0], data[1]);
            })
            this.vm.isLoading = false;
            
        },error =>{
            this.vm.isLoading = false;
        })
    }

    initialiseApprovalData(approvalList, approvalAccounts, approvalImages){
        approvalList.forEach(approval =>{
            if(approval.parentTransaction == null){
                let tempData = {
                    dbId: approval.id,
                    debitAccounts: [],
                    creditAccounts: [],
                    remark: approval.remark,
                    billImages: [],
                    quotationImages: [],
                    approvalId: approval.approvalId,
                    parentTransaction: approval.parentTransaction,
                    transactionDate: approval.transactionDate,
                    totalAmount: 0,
                }

                

                approvalAccounts.forEach(account =>{
                    if(account.parentApproval == approval.id){
                        let tempAccount = this.vm.accountsList.find(acccount => acccount.parentAccount == account.parentAccount);
                        if(account.transactionType == 'DEBIT'){
                            let temp_data = {
                                'debitAccount': tempAccount,
                                'debitAmount': account.amount,
                            }
                            tempData.debitAccounts.push(temp_data);
                        }
                        else{
                            let temp_data = {
                                'creditAccount': tempAccount,
                                'creditAmount': account.amount,
                            }
                            tempData.creditAccounts.push(temp_data);
                        }
                    }
                })
                approvalImages.forEach(image =>{
                    if(image.parentApproval == approval.id){
                        if(image.imageType == 'BILL'){
                            tempData.billImages.push(image);
                        }
                        else{
                            tempData.quotationImages.push(image);
                        }
                    }
                })

                tempData.debitAccounts.forEach(account =>{
                    tempData.totalAmount += account.debitAmount;
                })
                
                this.vm.approvalsList.push(tempData);
            }
        })
        this.vm.approvalsList.sort((a,b) => { return (b.approvalId - a.approvalId)});
        console.log(this.vm.approvalsList);
    }


    
    addTransactions():any{
        console.log(this.vm.transactions);
        let data = {
            'parentEmployee__parentSchool': this.vm.user.activeSchool.dbId,
            'korangle__order': '-voucherNumber',
            'korangle__count': '0,1',
        }
        let lastVoucherNumber = 1;
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, data),
        ]).then(val =>{
            if(val[0].length > 0){
                lastVoucherNumber = val[0][0].voucherNumber + 1;
            }
            let toCreateList = [];
            this.vm.transactions.forEach(transaction =>{
                let tempData = {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                    voucherNumber: lastVoucherNumber,
                    remark: transaction.remark,
                    transactionDate: this.vm.selectedDate,
                    approvalId: transaction.approvalId,
                }
                lastVoucherNumber = lastVoucherNumber + 1; 
                toCreateList.push(tempData);
            })
            Promise.all([
                this.vm.accountsService.createObjectList(this.vm.accountsService.transaction, toCreateList),
            ]).then(value =>{
                console.log(value);
                let toCreateAccountList = [];
                let toUpdateAccountBalanceList = [];
                const service = [];
                value[0].forEach((element,index) =>{
                    this.vm.transactions[index].debitAccounts.forEach(account =>{
                        let tempData = {
                            parentTransaction: element.id,
                            parentAccount: account.debitAccount.parentAccount,
                            amount: account.debitAmount,
                            transactionType: 'DEBIT',
                        }
                        toCreateAccountList.push(tempData);
                        let tempAccount = toUpdateAccountBalanceList.find(acccount => acccount.id == account.debitAccount.id);
                        if(tempAccount == undefined){
                            let tempData1 = {
                                id: account.debitAccount.id,
                                balance: account.debitAccount.balance + account.debitAmount
                            }
                            toUpdateAccountBalanceList.push(tempData1);
                        }
                        else{
                            tempAccount.balance += account.debitAccount;
                        }
                    });
                    this.vm.transactions[index].creditAccounts.forEach(account =>{
                        let tempData = {
                            parentTransaction: element.id,
                            parentAccount: account.creditAccount.parentAccount,
                            amount: account.creditAmount,
                            transactionType: 'CREDIT',
                        }
                        toCreateAccountList.push(tempData);
                        
                        let tempAccount = toUpdateAccountBalanceList.find(acccount => acccount.id == account.debitAccount.id);
                        if(tempAccount == undefined){
                            let tempData1 = {
                                id: account.debitAccount.id,
                                balance: account.debitAccount.balance - account.creditAmount
                            }
                            toUpdateAccountBalanceList.push(tempData1);
                        }
                        else{
                            tempAccount.balance -= account.creditAmount;
                        }
                    });
                    
                    
                    let i=1;
                    this.vm.transactions[index].billImages.forEach(image =>{
                        let tempData = {
                            parentTransaction: element.id,
                            imageURL: image.imageURL,
                            orderNumber: i,
                            imageType: 'BILL',
                        }
                        let temp_form_data = new FormData();
                        const layout_data = { ...tempData,};
                        Object.keys(layout_data).forEach(key => {
                            if (key === 'imageURL' ) {
                                temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i +'.jpeg'));
                            } else {
                                temp_form_data.append(key, layout_data[key]);
                            }
                        });
                        i = i + 1;
                        service.push(this.vm.accountsService.createObject(this.vm.accountsService.transaction_images, temp_form_data))

                    })
                    
                    i=1;
                    this.vm.transactions[index].quotationImages.forEach(image =>{
                        let tempData = {
                            parentTransaction: element.id,
                            imageURL: image.imageURL,
                            orderNumber: i,
                            imageType: 'QUOTATION',
                        }
                        let temp_form_data = new FormData();
                        const layout_data = { ...tempData,};
                        Object.keys(layout_data).forEach(key => {
                            if (key === 'imageURL' ) {
                                temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i +'.jpeg'));
                            } else {
                                temp_form_data.append(key, layout_data[key]);
                            }
                        });
                        i = i + 1;
                        service.push(this.vm.accountsService.createObject(this.vm.accountsService.transaction_images, temp_form_data))
                    })

                });
                service.push(this.vm.accountsService.createObjectList(this.vm.accountsService.transaction_account_details, toCreateAccountList));
                service.push(this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.account_session, toUpdateAccountBalanceList));
                Promise.all(service).then(data =>{
                    console.log(data);
                    this.vm.transactions = [];
                    this.vm.addNewTransaction();
                    alert('Transaction Recorded Successfully');
                })

            })

        })
        
    }

    requestApprovals(): any{
        // let tempList = [];
        // this.vm.transactions.forEach(transaction =>{
        //     if(transaction.approvalId == null){
        //         tempList.push(transaction);
        //     }
        // })
        // this.vm.transactions = tempList;
        let data = {
            'parentEmployeeRequestedBy__parentSchool': this.vm.user.activeSchool.dbId,
            'korangle__order': '-approvalId',
            'korangle__count': '0,1',
        }
        let lastApprovalID = 1;
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.approval, data),
        ]).then(val =>{
            console.log(val);
            if(val[0].length > 0){
                lastApprovalID = val[0][0].approvalId + 1;
            }
            let toCreateList = [];
            this.vm.transactions.forEach(transaction =>{
                let tempData = {
                    parentEmployeeRequestedBy: this.vm.user.activeSchool.employeeId,
                    remark: transaction.remark,
                    requestedGenerationDateTime: CommonFunctions.formatDate(new Date(), ''),
                    autoAdd: this.vm.autoAdd,
                    requestStatus: 'PENDING',
                    approvalId: lastApprovalID,
                    transactionDate: this.vm.selectedDate,

                }
                lastApprovalID = lastApprovalID + 1;
                toCreateList.push(tempData);
            })
            Promise.all([
                this.vm.accountsService.createObjectList(this.vm.accountsService.approval, toCreateList),
            ]).then(value =>{
                console.log(value);
                let toCreateAccountList = [];

                const services = [];
                value[0].forEach((element,index) =>{
                    this.vm.transactions[index].debitAccounts.forEach(account =>{
                        let tempData = {
                            parentApproval: element.id,
                            parentAccount: account.debitAccount.parentAccount,
                            amount: account.debitAmount,
                            transactionType: 'DEBIT',
                        }
                        toCreateAccountList.push(tempData);
                    });
                    this.vm.transactions[index].creditAccounts.forEach(account =>{
                        let tempData = {
                            parentApproval: element.id,
                            parentAccount: account.creditAccount.parentAccount,
                            amount: account.creditAmount,
                            transactionType: 'CREDIT',
                        }
                        toCreateAccountList.push(tempData);
                    });

                    let i=1;
                    this.vm.transactions[index].billImages.forEach(image =>{
                        let tempData = {
                            parentApproval: element.id,
                            imageURL: image.imageURL,
                            orderNumber: i,
                            imageType: 'BILL',
                        }
                        let temp_form_data = new FormData();
                        const layout_data = { ...tempData,};
                        Object.keys(layout_data).forEach(key => {
                            if (key === 'imageURL' ) {
                                temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i +'.jpeg'));
                            } else {
                                temp_form_data.append(key, layout_data[key]);
                            }
                        });
                        i = i + 1;
                        services.push(this.vm.accountsService.createObject(this.vm.accountsService.approval_request_images, temp_form_data))

                    })
                    
                    i=1;
                    this.vm.transactions[index].quotationImages.forEach(image =>{
                        let tempData = {
                            parentApproval: element.id,
                            imageURL: image.imageURL,
                            orderNumber: i,
                            imageType: 'QUOTATION',
                        }
                        let temp_form_data = new FormData();
                        const layout_data = { ...tempData,};
                        Object.keys(layout_data).forEach(key => {
                            if (key === 'imageURL' ) {
                                temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i +'.jpeg'));
                            } else {
                                temp_form_data.append(key, layout_data[key]);
                            }
                        });
                        i = i + 1;
                        services.push(this.vm.accountsService.createObject(this.vm.accountsService.approval_request_images, temp_form_data))
                    })
                });
                services.push(this.vm.accountsService.createObjectList(this.vm.accountsService.approval_request_account_details, toCreateAccountList));
                Promise.all(services).then(data =>{
                    console.log(data);
                    this.vm.transactions = [];
                    this.vm.addNewTransaction();
                    alert('Approval Request Generated Successfully');
                })

            })
        })
        
    }
    
    

}
