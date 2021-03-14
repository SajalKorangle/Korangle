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
                this.vm.approvalsList = [];

                let request_account_title_data = {
                    parentSchool: this.vm.user.activeSchool.dbId,
                    accountType: 'ACCOUNT',
                }

                let request_account_data = {
                    parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
                    parentAccount__accountType: 'ACCOUNT',
                    parentSession: this.vm.user.activeSchool.currentSessionDbId, 
                }

                let employee_data = {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                }

                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_data),
                    this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_title_data),
                ]).then(value =>{
                    console.log(value);
                    this.vm.htmlRenderer.minimumDate = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).startDate;  // change for current session
                    this.vm.htmlRenderer.maximumDate = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).endDate;
                    this.vm.backendData.accountSessionList = value[0];
                    this.vm.backendData.accountList = value[3];
                    if(value[1].length > 0){
                        this.vm.maximumPermittedAmount = value[1][0].restrictedAmount;
                    }
                    else{
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
                        this.vm.accountsService.getObjectList(this.vm.accountsService.approval_request_account_details, approval_account_details),
                        this.vm.accountsService.getObjectList(this.vm.accountsService.approval_request_images, approval_images),
                    ]).then(val => {
                        
                        this.initialiseApprovalData(val[0], val[1], val[2]);
                        this.vm.isLoading = false;
        
                    });
                    
                },error =>{
                    this.vm.isLoading = false;
                })
            } else {
                this.vm.isLoading=false;
                alert("Unexpected errors. Please contact admin");
            }
        }, error => {
            this.vm.isLoading = false;
        });
    }

    initialiseApprovalData(approvalList, approvalAccountList, approvalImageList){
        approvalList.forEach(approval => {

            let tempData = {
                dbId: approval.id,
                debitAccountList: [],
                creditAccountList: [],
                remark: approval.remark,
                billImages: [],
                quotationImages: [],
                approvalId: approval.approvalId,
                parentTransaction: approval.parentTransaction,
                transactionDate: approval.transactionDate,
                totalAmount: 0,
            };

            approvalAccountList.forEach(approvalAccount =>{
                if(approvalAccount.parentApproval == approval.id){
                    let tempAccount = this.vm.htmlRenderer.accountSessionList.find(acccount => acccount.parentAccount == approvalAccount.parentAccount);
                    if(approvalAccount.transactionType == 'DEBIT'){
                        let temp_data = {
                            'debitAccount': tempAccount,
                            'debitAmount': approvalAccount.amount,
                        }
                        tempData.debitAccountList.push(temp_data);
                    }
                    else{
                        let temp_data = {
                            'creditAccount': tempAccount,
                            'creditAmount': approvalAccount.amount,
                        }
                        tempData.creditAccountList.push(temp_data);
                    }
                }
            });

            approvalImageList.forEach(image =>{
                if(image.parentApproval == approval.id){
                    this.getBase64FromUrl(image.imageURL).then(data64URL =>{
                        image.imageURL = data64URL; 
                    })
                    if(image.imageType == 'BILL'){
                        tempData.billImages.push(image);
                    }
                    else{
                        tempData.quotationImages.push(image);
                    }
                }
            });

            tempData.debitAccountList.forEach(account =>{
                tempData.totalAmount += account.debitAmount;
            });
            
            this.vm.approvalsList.push(tempData);
        });
        this.vm.approvalsList.sort((a,b) => { return (b.approvalId - a.approvalId)});
    }

    addTransactions():any {
        this.vm.isLoading = true;
        let data = {
            'parentEmployee__parentSchool': this.vm.user.activeSchool.dbId,
            'transactionDate__gte': this.vm.htmlRenderer.minimumDate,
            'transactionDate__lte': this.vm.htmlRenderer.maximumDate,
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
            this.vm.transactionList.forEach(transaction =>{
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
                // console.log(value);
                let toCreateAccountList = [];
                const service = [];
                value[0].forEach((element,index) =>{
                    this.vm.transactionList[index].debitAccountList.forEach(account =>{
                        let tempData = {
                            parentTransaction: element.id,
                            parentAccount: account.debitAccount.parentAccount,
                            amount: account.debitAmount,
                            transactionType: 'DEBIT',
                        }
                        toCreateAccountList.push(tempData);
                    });
                    this.vm.transactionList[index].creditAccountList.forEach(account =>{
                        let tempData = {
                            parentTransaction: element.id,
                            parentAccount: account.creditAccount.parentAccount,
                            amount: account.creditAmount,
                            transactionType: 'CREDIT',
                        }
                        toCreateAccountList.push(tempData);
                    });
                    
                    
                    let i=1;
                    this.vm.transactionList[index].billImages.forEach(image =>{
                        let tempData = {
                            parentTransaction: element.id,
                            imageURL: image.imageURL,
                            orderNumber: i,
                            imageType: 'BILL',
                        }
                        console.log(tempData);
                        let temp_form_data = new FormData();
                        const layout_data = { ...tempData,};
                        console.log(layout_data);
                        Object.keys(layout_data).forEach(key => {
                            if (key === 'imageURL' ) {
                                temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i +'.jpeg'));
                            } else {
                                temp_form_data.append(key, layout_data[key]);
                            }
                        });
                        console.log(temp_form_data);
                        i = i + 1;
                        service.push(this.vm.accountsService.createObject(this.vm.accountsService.transaction_images, temp_form_data))

                    })
                    
                    i=1;
                    this.vm.transactionList[index].quotationImages.forEach(image =>{
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
                Promise.all(service).then(data => {

                    this.vm.transactionList = [];
                    this.vm.htmlRenderer.addNewTransaction();

                    // Write down the number of transactions that have been recorded in alert message.
                    alert('Transaction Recorded Successfully');

                    this.vm.isLoading = false;
                })

            })

        })
        
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
          }
        })
    }
    
}
