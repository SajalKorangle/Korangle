import { profile } from 'console';
import { ViewBalanceComponent } from './view-balance.component'

export class ViewBalanceServiceAdapter {

    vm: ViewBalanceComponent;
    constructor() {}
    // Data

    initializeAdapter(vm: ViewBalanceComponent): void {
        this.vm = vm;
    }

    accountsSessionList: any;
    accountsList: any;

    //initialize data
    initializeData(): void {
        let request_account_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        }
        this.vm.isLoading = true;
        let employee_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };


        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.heads, {}),
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_data),

        ]).then(value =>{
            this.vm.employeeList = value[3];
            this.vm.minimumDate = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).startDate;  // change for current session
            this.vm.maximumDate = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).endDate;
            this.vm.headsList = value[0];
            console.log(value);
            let account_id_list = [];
            value[1].forEach(account =>{
                account_id_list.push(account.id);
            })
            let request_account_session_data = {
                'parentAccount__in': account_id_list,
                'parentSession': this.vm.user.activeSchool.currentSessionDbId, 
            }
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),
            ]).then(data =>{
                this.accountsList = value[1];
                this.accountsSessionList = data[0];
                this.initialiseAccountGroupList();
                this.initialiseDisplayData();
                this.vm.isLoading = false;
            }, error =>{
                this.vm.isLoading = false;
            })
        },error =>{
            this.vm.isLoading = false;
        })

    }

    initialiseAccountGroupList(){
        this.vm.accountsList = [];
        this.vm.groupsList = [];
        this.accountsSessionList.forEach(account =>{
            let type = this.accountsList.find(accounts => accounts.id == account.parentAccount).accountType;
            account['type'] = type;
            if(type == 'ACCOUNT'){
                this.vm.accountsList.push(account);
            }
            else{
                this.vm.groupsList.push(account);
            }
        })
        // console.log(this.vm.accountsList);
        console.log(this.vm.groupsList);
        return ;
    }


    initialiseDisplayData(){
        let accountsSessionList = JSON.parse(JSON.stringify(this.accountsSessionList));
        let parentGroupsList = [];
        let individualAccountList = [];
        // while(accountsSessionList.length > 0){
            for(let i=0;i<accountsSessionList.length; i++){
                let type = this.accountsList.find(accounts => accounts.id == accountsSessionList[i].parentAccount).accountType;
                accountsSessionList[i]['type'] = type;
                if(type == 'ACCOUNT'){
                    // console.log('account' , accountsSessionList[i].title);
                    if(accountsSessionList[i].parentGroup == null){
                        // console.log('individual' , accountsSessionList[i].title);
                        individualAccountList.push(accountsSessionList[i]);
                        accountsSessionList.splice(i,1);
                        i--;
                    }
                    else{
                        let tempGroup = parentGroupsList.find(group => group.parentAccount == accountsSessionList[i].parentGroup);
                        if(tempGroup == undefined){
                            // console.log('parent Group Not Found');
                            let parentGroupIndex =  accountsSessionList.map(function(e) { return e.parentAccount; }).indexOf(accountsSessionList[i].parentGroup);
                            let parentGroupData = JSON.parse(JSON.stringify(accountsSessionList[parentGroupIndex]));
                            // console.log('parent Group in all list', parentGroupData.title);
                            
                            parentGroupData['childs'] = [];
                            parentGroupData.childs.push(accountsSessionList[i]);
                            parentGroupsList.push(parentGroupData);
                            accountsSessionList.splice(parentGroupIndex, 1);
                            if(parentGroupIndex <= i){
                                i--;
                            }
                            accountsSessionList.splice(i,1);
                            i--;
                        }
                        else{
                            // console.log('parent Group Found', tempGroup.title);
                            tempGroup.childs.push(accountsSessionList[i]);
                            accountsSessionList.splice(i,1);
                            i--;
                        }
                    }
                }
            }
        // }

        for(let i=0;i<accountsSessionList.length; i++){
            parentGroupsList.push(accountsSessionList[i]);
        }
        
        for(let i=0; i<parentGroupsList.length; i++){
           
            if(parentGroupsList[i].parentGroup != null){
                parentGroupsList.find(gro => gro.parentAccount == parentGroupsList[i].parentGroup).childs.push(parentGroupsList[i]);
            }
            
        }

        for(let i=0; i<parentGroupsList.length; i++){
            if(parentGroupsList[i].parentGroup != null){
                parentGroupsList.splice(i, 1);
                i--;
            }
        }
        this.populateHeadWiseDisplayList(parentGroupsList, individualAccountList);

    }

    populateHeadWiseDisplayList(groupsList, individualAccountList){
        this.vm.expensesList = [];
        this.vm.incomeList = [];
        this.vm.assetsList = [];
        this.vm.liabilityList = [];
        groupsList.forEach(group =>{
            let head = this.vm.headsList.find(head => head.id == group.parentHead).title;
            if(head == 'Expenses'){
                this.vm.expensesList.push(group);
            }
            else if(head == 'Income'){
                this.vm.incomeList.push(group);
            }
            else if(head == 'Assests'){
                this.vm.assetsList.push(group);
            }
            else if(head == 'Liabilities'){
                this.vm.liabilityList.push(group);
            }

        })
        individualAccountList.forEach(account =>{
            let head = this.vm.headsList.find(head => head.id == account.parentHead).title;
            if(head == 'Expenses'){
                this.vm.expensesList.push(account);
            }
            else if(head == 'Income'){
                this.vm.incomeList.push(account);
            }
            else if(head == 'Assests'){
                this.vm.assetsList.push(account);
            }
            else if(head == 'Liabilities'){
                this.vm.liabilityList.push(account);
            }

        })
        console.log(this.vm.expensesList);
        console.log(this.vm.incomeList);
        console.log(this.vm.assetsList);
        console.log(this.vm.liabilityList);

    }
    
    loadTransactions(){
        this.vm.transactionsList = [];
        let data = {
            parentAccount: this.vm.ledgerAccount.parentAccount,
            parentTransaction__transactionDate__lte: this.vm.maximumDate,
            parentTransaction__transactionDate__gte: this.vm.minimumDate,
            fields__korangle: 'parentTransaction',
        }
        console.log(data);
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, data),
        ]).then(val =>{
            console.log(val);
            let transction_id_list = [];
            val[0].forEach(element =>{
                transction_id_list.push(element.parentTransaction);
            })
            let transaction_data = {
                id__in: transction_id_list,
            }
            let transaction_details_data = {
                parentTransaction__in: transction_id_list,
            } 
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, transaction_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_details_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_details_data),
            ]).then(data =>{
                this.initialiseTransactionData(data[0], data[1], data[2]);
                this.vm.isLedgerLoading = false;
            })
        })
    }

    initialiseTransactionData(transactionList, transactionAccounts, transactionImages){
        for(let j=0;j<transactionList.length ; j++){
            let transaction = transactionList[j];
            let totalAmount = 0;
            let ledgerAccountAmount;
            let ledgerAccountType;
        
            let tempData = {
                dbId: transaction.id,
                debitAccounts: [],
                creditAccounts: [],
                accounts: [],
                remark: transaction.remark,
                billImages: [],
                quotationImages: [],
                approvalId: transaction.approvalId,
                voucherNumber: transaction.voucherNumber,
                transactionDate: transaction.transactionDate,
                parentEmployeeName: null,
                parentEmployee: transaction.parentEmployee,
            }

            tempData.parentEmployeeName = this.vm.employeeList.find(employee => employee.id == transaction.parentEmployee).name;

            for(let i=0;i<transactionAccounts.length; i++){
                let account = transactionAccounts[i];
                if(account.parentTransaction == transaction.id){
                    let tempAccount = this.vm.accountsList.find(acccount => acccount.parentAccount == account.parentAccount);
                    if(tempAccount.parentAccount == this.vm.ledgerAccount.parentAccount){
                        ledgerAccountAmount = account.amount;
                        ledgerAccountType = account.transactionType;
                    }
                    let temp = {
                        dbId: tempAccount.id,
                        accountDbId: tempAccount.parentAccount,
                        account: tempAccount.title,
                        amount: account.amount,
                        transactionAccountDbId: account.id,
                        parentHead: tempAccount.parentHead,
                        parentGroup: tempAccount.parentGroup,
                    }
                    if(account.transactionType == 'DEBIT'){
                        tempData.debitAccounts.push(temp);
                        totalAmount += account.amount;
                    }
                    else{
                        tempData.creditAccounts.push(temp);
                    }
                    let temp_data = {
                        accountTitle: tempAccount.title,
                        amount: account.amount,
                        type: account.transactionType,
                    }
                    tempData.accounts.push(temp_data);
                }
            }

            for(let i=0;i<tempData.accounts.length; i++){
                let account = tempData.accounts[i];
                if(ledgerAccountType == account.type){
                    console.log(account.type);
                    tempData.accounts.splice(i, 1);
                    i--;
                }
                else{
                    account.amount = (account.amount * ledgerAccountAmount )/totalAmount;
                }
            }

            for(let i=0;i<transactionImages.length ; i++){
                let image = transactionImages[i];
                if(image.parentTransaction == transaction.id){
                    if(image.imageType == 'BILL'){
                        tempData.billImages.push(image);
                    }
                    else{
                        tempData.quotationImages.push(image);
                    }
                    transactionImages.splice(i, 1);
                    i--;
                }

            }
            tempData.billImages.sort((a,b) => { return (a.orderNumber - b.orderNumber)});
            tempData.quotationImages.sort((a,b) => { return (a.orderNumber - b.orderNumber)});
            this.vm.transactionsList.push(tempData);
        }

        console.log(this.vm.transactionsList);
    }

}
