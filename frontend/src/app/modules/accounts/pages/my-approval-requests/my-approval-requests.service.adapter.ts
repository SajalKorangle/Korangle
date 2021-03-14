import { MyApprovalRequestsComponent } from './my-approval-requests.component';

export class MyApprovalRequestsServiceAdapter {

    vm : MyApprovalRequestsComponent;

    initialiseAdapter(vm: MyApprovalRequestsComponent){
        this.vm = vm;
    }

    initialiseData(){

        this.vm.isLoading = true;

        let request_account_session_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId, 
            parentAccount__accountType: 'ACCOUNT',
        }
        
        let request_account_title_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            accountType: 'ACCOUNT',
        }

        let employee_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            // resterict to required fields only
        };

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),   // 0
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_data),    // 1
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 2
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_title_data),    // 3
        ]).then(value =>{
            this.vm.accountsList = value[0];
            this.vm.employeeList = value[1];

            const currentSession = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
            this.vm.minimumDate = currentSession.startDate;  // change for current session
            this.vm.maximumDate = currentSession.endDate;

            this.populateAccountTitle(value[3]);
            
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
                    this.vm.accountsService.getObjectList(this.vm.accountsService.approval_account_details, approval_details_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.approval_images, approval_details_data),
                ]).then(data =>{
                    this.initialiseApprovalData(val[0], data[0], data[1]);
                    this.vm.isLoading = false
                })
            })
            
        })
        
    }

    populateAccountTitle(accountTitleList){
        this.vm.accountsList.forEach(acc =>{
            acc['title'] = accountTitleList.find(account => account.id == acc.parentAccount).title;
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
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval_account_details, approval_details_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.approval_images, approval_details_data),
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
            }

            tempData.requestedByName = this.vm.employeeList.find(employee => employee.id == tempData.requestedBy).name;
            if(tempData.approvedBy != null)
                tempData.approvedByName = this.vm.employeeList.find(employee => employee.id == tempData.approvedBy).name;

            approvalAccounts.forEach(account =>{
                if(account.parentApproval == approval.id){
                    let tempAccount = this.vm.accountsList.find(acc => acc.parentAccount == account.parentAccount);
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
                    if(approval.parentTransaction == null && approval.requestStatus == 'APPROVED'){                 //change implementation here
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