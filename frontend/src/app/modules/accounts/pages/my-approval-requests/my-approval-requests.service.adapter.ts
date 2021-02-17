import { MyApprovalRequestsComponent } from './my-approval-requests.component'
import { CommonFunctions } from './../../../../classes/common-functions'
import { ThrowStmt } from '@angular/compiler';

export class MyApprovalRequestsServiceAdapter {

    vm : MyApprovalRequestsComponent;

    initialiseAdapter(vm: MyApprovalRequestsComponent){
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
            
            this.vm.minimumDate = value[2].find(session => session.id == 4).startDate;  // change for current session
            this.vm.maximumDate = value[2].find(session => session.id == 4).endDate;
            let approval_id = [];
            let approval_request_data = {
                'parentEmployeeRequestedBy': this.vm.user.activeSchool.employeeId,
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
                    if(value[0].length < this.vm.loadingCount){
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
            parentEmployeeRequestedBy: this.vm.user.activeSchool.employeeId,
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
            if(value[0].length < this.vm.loadingCount){
                this.vm.loadMoreApprovals = false;
            }
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

    

}