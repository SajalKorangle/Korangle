import { UpdateTransactionComponent } from './update-transaction.component'

export class UpdateTransactionServiceAdapter {

    vm: UpdateTransactionComponent;
    constructor() {}
    // Data

    transaction_id_list = [];

    initializeAdapter(vm: UpdateTransactionComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;
        this.vm.transactionsList = [];
        this.vm.maximumPermittedAmount = null;
        let request_account_session_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId, 
            parentAccount__accountType: 'ACCOUNT',
        }
        
        let employee_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
        }

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_data),
        ]).then(value =>{
            // console.log(value);
            if(value[2].length > 0){
                this.vm.maximumPermittedAmount = value[2][0].restrictedAmount;
            }
            this.vm.minimumDate = value[1].find(session => session.id == 4).startDate;  // change for current session
            this.vm.maximumDate = value[1].find(session => session.id == 4).endDate;
            console.log(this.vm.minimumDate, this.vm.maximumDate);
            this.vm.accountsList = value[0];
            this.vm.isLoading = false;
        });
        
    

    }

    findTransactionByVNumber(event: any){
        this.vm.transactionsList = [];
        this.vm.isLoadingTransaction = true;
        let data = {
            voucherNumber: event.target.value,
            parentEmployee: this.vm.user.activeSchool.employeeId,
            transactionDate__gte: this.vm.minimumDate,
            transactionDate__lte: this.vm.maximumDate, 
        }
        // console.log(data);
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, data),
        ]).then(val =>{
            // console.log(val);
            if(val[0].length > 0){
                let transaction_data = {
                    parentTransaction: val[0][0].id,
                }
                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_data),
                ]).then(data =>{
                    console.log(data);
                    this.initialiseTransactionData(val[0], data[0], data[1]);
                    this.vm.isLoadingTransaction = false;
                })
            }
            else{
                this.vm.isLoadingTransaction = false;
            }
        })
    }

    findTransactionByAccount(account: any){
        this.vm.transactionsList = [];
        this.vm.loadMoreTransaction = true;
        this.vm.isLoadingTransaction = true;
        this.transaction_id_list = [];
        // console.log(account);
        let data = {
            parentTransaction__parentEmployee: this.vm.user.activeSchool.employeeId,
            parentAccount: account.parentAccount,
            parentTransaction__transactionDate__gte:  this.vm.minimumDate,
            parentTransaction__transactionDate__lte:  this.vm.maximumDate,
            fields__korangle: 'parentTransaction',
            korangle__order: '-parentTransaction'
            
        }

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, data),
        ]).then(value =>{
            value[0].forEach(ele =>{
                this.transaction_id_list.push(ele.parentTransaction);
            })
            // this.transaction_id_list = value[0];
            this.transaction_id_list = this.transaction_id_list.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            })
            // console.log(this.transaction_id_list);
            
            let min = Math.min(this.vm.loadingCount, this.transaction_id_list.length);
            if(min < this.vm.loadingCount){
                this.vm.loadMoreTransaction = false;
            }

            let transaction_id_list = [];
            for(let i=0;i<min; i++){
                transaction_id_list.push(this.transaction_id_list[0]);  
                this.transaction_id_list.splice(0,1);  
            }
            let data = {
                id__in: transaction_id_list,
            }
            // console.log(this.transaction_id_list);
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, data),
            ]).then(val =>{
                // console.log(val);
                if(val[0].length > 0){
                    
                    let transaction_data = {
                        parentTransaction__in: transaction_id_list,
                    }
                    Promise.all([
                        this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_data),
                        this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_data),
                    ]).then(data =>{
                        console.log(data);
                        this.initialiseTransactionData(val[0], data[0], data[1]);
                        this.vm.isLoadingTransaction = false;
                    })
                }
                else{
                    this.vm.isLoadingTransaction = false;
                }
            })
        })
    }

    loadMoreTransaction(){
        this.vm.isLoadingTransaction = true;
        let min = Math.min(this.vm.loadingCount, this.transaction_id_list.length);
        if(min < this.vm.loadingCount){
            this.vm.loadMoreTransaction = false;
        }

        let transaction_id_list = [];
        for(let i=0;i<min; i++){
            transaction_id_list.push(this.transaction_id_list[0]);  
            this.transaction_id_list.splice(0,1);  
        }
        let data = {
            id__in: transaction_id_list,
        }
        // console.log(this.transaction_id_list);
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, data),
        ]).then(val =>{
            console.log(val);
            if(val[0].length > 0){
                
                let transaction_data = {
                    parentTransaction__in: transaction_id_list,
                }
                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_data),
                    this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_data),
                ]).then(data =>{
                    console.log(data);
                    this.initialiseTransactionData(val[0], data[0], data[1]);
                    this.vm.isLoadingTransaction = false;
                })
            }
            else{
                this.vm.isLoadingTransaction = false;
            }
        })

    }

    initialiseTransactionData(transactionList, transactionAccounts, transactionImages){
        transactionList.forEach(transaction =>{
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
            }

            transactionAccounts.forEach(account =>{
                if(account.parentTransaction == transaction.id){
                    let tempAccount = this.vm.accountsList.find(acccount => acccount.parentAccount == account.parentAccount);
                    let temp = {
                        dbId: tempAccount.id,
                        accountDbId: tempAccount.parentAccount,
                        account: tempAccount.title,
                        amount: account.amount,
                        transactionAccountDbId: account.id,
                        balance: tempAccount.balance,
                    }
                    if(account.transactionType == 'DEBIT'){
                        tempData.debitAccounts.push(temp);
                    }
                    else{
                        tempData.creditAccounts.push(temp);
                    }
                }
            })
            transactionImages.forEach(image =>{
                if(image.parentTransaction == transaction.id){
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
            this.vm.transactionsList.push(tempData);

        })
        this.vm.transactionsList.sort((a,b) => { return (b.voucherNumber - a.voucherNumber)});
        // console.log(this.vm.transactionsList);
    }

    
    
    

}
