import { GrantApprovalComponent } from './grant-approval.component'
import { CommonFunctions } from './../../../../classes/common-functions'

export class GrantApprovalServiceAdapter {

    vm : GrantApprovalComponent;

    initialiseAdapter(vm: GrantApprovalComponent){
        this.vm = vm;
    }

    initialiseData(){

        this.vm.approvalsList = [];
        this.vm.loadMoreApprovals = true;
        this.vm.isLoadingApproval = true;

        

        let request_account_session_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId, 
            parentAccount__accountType: 'ACCOUNT',
        }
        
        let employee_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
        ]).then(value =>{
            this.vm.accountsList = value[0];
            this.vm.employeeList = value[1];
            
            this.vm.minimumDate = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).startDate;  // change for current session
            this.vm.maximumDate = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).endDate;
            let approval_id = [];
            let approval_request_data = {
                'parentEmployeeRequestedBy__parentSchool': this.vm.user.activeSchool.dbId,
                'requestedGenerationDateTime__gte': this.vm.minimumDate,
                'requestedGenerationDateTime__lte': this.vm.maximumDate,
                'korangle__order': '-id',
                'korangle__count': this.vm.approvalsList.length.toString() + ',' + this.vm.loadingCount.toString(),
            }
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval, approval_request_data),
            ]).then(val =>{
                val[0].forEach(approval =>{
                    approval_id.push(approval.id);
                })
                let approval_details_data = {
                    'parentApproval__in': approval_id,
                }
                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.approval_request_account_details, approval_details_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.approval_request_images, approval_details_data),
                ]).then(data =>{
                    this.initialiseApprovalData(val[0], data[0], data[1]);
                    this.vm.isLoadingApproval = false;
                    if(val[0].length < this.vm.loadingCount){
                        this.vm.loadMoreApprovals = false;
                    }
                },error =>{
                    this.vm.isLoadingApproval = false;
                })
            })
            
        }, error =>{
            this.vm.isLoadingApproval = false;
        })
        
    }

    loadMoreApprovals(){
        this.vm.isLoadingApproval = true;

        let approval_request_data = {
            parentEmployeeRequestedBy__parentSchool: this.vm.user.activeSchool.dbId,
            'requestedGenerationDateTime__gte': this.vm.minimumDate,
            'requestedGenerationDateTime__lte': this.vm.maximumDate,
            'korangle__order': '-id',
            'korangle__count': this.vm.approvalsList.length.toString() + ',' + (this.vm.approvalsList.length + this.vm.loadingCount).toString(),
        }
        console.log(approval_request_data);
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.approval, approval_request_data),
        ]).then(value =>{
            console.log(value);
            let approval_id = [];
            value[0].forEach(approval =>{
                approval_id.push(approval.id);
            })
            let approval_details_data = {
                'parentApproval__in': approval_id,
            }
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval_request_account_details, approval_details_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval_request_images, approval_details_data),
            ]).then(data =>{
                this.initialiseApprovalData(value[0], data[0], data[1]);
                this.vm.isLoadingApproval = false;
                
                if(value[0].length < this.vm.loadingCount){
                    this.vm.loadMoreApprovals = false;
                }
            })
        },error =>{
            this.vm.isLoadingApproval = false;
        })

    }

    initialiseApprovalData(approvalList, approvalAccounts, approvalImages){
        approvalList.forEach(approval =>{
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
            }

            tempData.requestedByName = this.vm.employeeList.find(employee => employee.id == tempData.requestedBy).name;
            if(tempData.approvedBy != null)
            tempData.approvedByName = this.vm.employeeList.find(employee => employee.id == tempData.approvedBy).name;

            approvalAccounts.forEach(account =>{
                if(account.parentApproval == approval.id){
                    let tempAccount = this.vm.accountsList.find(acccount => acccount.parentAccount == account.parentAccount);
                    let temp = {
                        dbId: tempAccount.id,
                        accountDbId: tempAccount.parentAccount,
                        account: tempAccount.title,
                        amount: account.amount,
                        balance: tempAccount.balance,
                        parentHead: tempAccount.parentHead,
                        parentGroup: tempAccount.parentGroup,
                    }
                    if(account.transactionType == 'DEBIT'){
                        tempData.debitAccounts.push(temp);
                    }
                    else{
                        tempData.creditAccounts.push(temp);
                    }
                }
            })
            approvalImages.forEach(image =>{
                if(image.parentApproval == approval.id){
                    if(approval.parentTransaction == null && approval.autoAdd){                
                        this.getBase64FromUrl(image.imageURL).then(data64URL =>{
                            image.imageURL = data64URL; 
                        })
                    }
                    if(image.imageType == 'BILL'){
                        tempData.billImages.push(image);
                    }
                    else{
                        tempData.quotationImages.push(image);
                    }
                }
            })
            
            tempData.billImages.sort((a,b) => { return (a.orderNumber - b.orderNumber)});
            tempData.quotationImages.sort((a,b) => { return (a.orderNumber - b.orderNumber)});
            this.vm.approvalsList.push(tempData);

        })
        this.vm.approvalsList.sort((a,b) => { return (b.approvalId - a.approvalId)});
        console.log(this.vm.approvalsList);
    }

    async changeApprovalStatus(approval, status){
        approval.requestStatus = status;
        let tempData = {
            id: approval.dbId,
            requestStatus: approval.requestStatus,
            parentEmployeeApprovedBy: this.vm.user.activeSchool.employeeId,
            approvedGenerationDateTime: CommonFunctions.formatDate(new Date(), ''),
        }
        // console.log(approval);
        Promise.all([
            this.vm.accountsService.partiallyUpdateObject(this.vm.accountsService.approval, tempData),
        ]).then(value =>{
            // console.log(value);
            if(approval.autoAdd && status=='APPROVED'){
                let data = {
                    'parentEmployee__parentSchool': this.vm.user.activeSchool.dbId,
                    'transactionDate__gte': this.vm.minimumDate,
                    'transactionDate__lte': this.vm.maximumDate,
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
                    let transaction_data = {
                        parentEmployee: approval.requestedBy,
                        voucherNumber: lastVoucherNumber,
                        remark: approval.remark,
                        transactionDate: approval.transactionDate,
                        approvalId: approval.approvalId,

                    }
                    Promise.all([
                        this.vm.accountsService.createObject(this.vm.accountsService.transaction, transaction_data),
                    ]).then(value1 =>{
                        // console.log(value1);
                        let toCreateAccountList = [];
                        let toUpdateAccountBalanceList = [];
                        const service = [];

                        // value[0].forEach((element,index) =>{
                        approval.debitAccounts.forEach(account =>{
                            let tempData = {
                                parentTransaction: value1[0].id,
                                parentAccount: account.accountDbId,
                                amount: account.amount,
                                transactionType: 'DEBIT',
                            }
                            toCreateAccountList.push(tempData);
                            let tempData1 = {
                                id: account.dbId,
                                balance: account.balance + account.amount,
                            }
                            toUpdateAccountBalanceList.push(tempData1);
                        });
                        approval.creditAccounts.forEach(account =>{
                            let tempData = {
                                parentTransaction: value1[0].id,
                                parentAccount: account.accountDbId,
                                amount: account.amount,
                                transactionType: 'CREDIT',
                            }
                            toCreateAccountList.push(tempData);
                            
                            let tempData1 = {
                                id: account.dbId,
                                balance: account.balance - account.amount,
                            }
                            toUpdateAccountBalanceList.push(tempData1);
                        });
                            
                            
                        let i=1;
                    
                        i=1;
                        approval.billImages.forEach(image =>{
                            let tempData = {
                                parentTransaction: value1[0].id,
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
                        approval.quotationImages.forEach(image =>{
                            let tempData = {
                                parentTransaction: value1[0].id,
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
                        service.push(this.vm.accountsService.createObjectList(this.vm.accountsService.transaction_account_details, toCreateAccountList));
                        service.push(this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.account_session, toUpdateAccountBalanceList));
                        
                        let tempData = {
                            id: approval.dbId,
                            parentTransaction: value1[0].id,
                        }
                        approval.parentTransaction = value1[0].id;
                        approval.approvedGenerationDateTime = CommonFunctions.formatDate(new Date(), ''),
                        service.push(this.vm.accountsService.partiallyUpdateObject(this.vm.accountsService.approval, tempData))


                        // });
                        Promise.all(service).then(data =>{
                            console.log(data);
                            alert('Request Status Changed Successfully');
                        })
                    })
                })
            }
            else{
                alert('Request Status Changed Successfully');
            }
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

