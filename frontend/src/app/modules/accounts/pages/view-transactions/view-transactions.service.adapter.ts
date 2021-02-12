import { ViewTransactionsComponent } from './view-transactions.component'

export class ViewTransactionsServiceAdapter { 
    
    vm: ViewTransactionsComponent;

    initialiseAdapter(vm: ViewTransactionsComponent){
        this.vm = vm;
    }


    initialiseData(){
        this.vm.isInitialLoading = true;
        this.vm.isLoading = true;
        this.vm.loadMoreTransactions = true;
        this.vm.columnFilter.voucherNumber.value = true;
        this.vm.columnFilter.date.value = true;
        this.vm.columnFilter.debitAccount.value = true;
        this.vm.columnFilter.creditAccount.value = true;
        this.vm.columnFilter.remark.value = true;
        this.vm.columnFilter.addedBy.value = false;
        this.vm.columnFilter.bill.value = false;
        this.vm.columnFilter.quotation.value = false;

        let request_account_session_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId, 
        }

        let request_account_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        }

        
        let employee_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_data),
            this.vm.accountsService.getObjectList(this.vm.accountsService.heads, {}),
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),
        ]).then(value =>{
            console.log(value);
            this.initialiseGroupsAndAccountList(value[0], value[3])
            this.vm.headsList = value[2];
            this.vm.isInitialLoading = false;
            this.vm.employeeList = value[1];
            this.popoulateAccountsList();
            this.popoulateEmployeeList();
            this.popoulateHeadList();
            this.popoulateGroupsList();
        },error =>{
            this.vm.isInitialLoading = false;
        })

    }
    
    initialiseGroupsAndAccountList(sessionList, typeList): any{
        this.vm.accountsList = [];
        this.vm.groupsList = [];
        sessionList.forEach(account =>{
            let type = typeList.find(accounts => accounts.id == account.parentAccount).accountType;
            if(type == 'ACCOUNT'){
                this.vm.accountsList.push(account);
            }
            else{
                this.vm.groupsList.push(account);
            }
        });
        console.log(this.vm.accountsList);
        console.log(this.vm.groupsList);
    }

    popoulateAccountsList(): any{
        let accounts = [];

        this.vm.accountsList.forEach(element =>{
            let tempAccount = {
                accountDbId: element.parentAccount,
                title: element.title,
                selected: true,
                currentBalance: 0,
            }
            accounts.push(tempAccount);
        })
        this.vm.filterAccountsList = accounts;
    }
  
    popoulateEmployeeList(): any{
        let employees = [];
        
        this.vm.employeeList.forEach(element =>{
            let temp = {
                employeeId: element.id,
                name: element.name,
                selected: true,
            }
            employees.push(temp);
        })
        this.vm.filterEmployeeList = employees;
    }

    popoulateHeadList(): any{
        let heads = [];
        
        this.vm.headsList.forEach(element =>{
            let temp = {
                headDbId: element.id,
                title: element.title,
                selected: true,
            }
            heads.push(temp);
        })
        this.vm.filterHeadsList = heads;
    }

    popoulateGroupsList(): any{
        let groups = [];
        let temp = {
            groupDbId: -1,
            title: 'Individual Accounts',
            selected: true,
        }
        groups.push(temp);
        this.vm.groupsList.forEach(element =>{
            let temp = {
                groupDbId: element.parentAccount,
                title: element.title,
                selected: true,
            }
            groups.push(temp);
        })
        this.vm.filterGroupsList = groups;
    }


    loadTransactions():any{
        this.vm.transactionsList = [];
        this.vm.isLoading = true;
        let transaction_data = {
            'parentEmployee__parentSchool': this.vm.user.activeSchool.dbId,
            'korangle__order': '-id',
            'korangle__count': this.vm.transactionsList.length.toString() + ',' + this.vm.loadingCount.toString(),
            'transactionDate__gte': this.vm.startDate,
            'transactionDate__lte': this.vm.endDate,
            
        }
        console.log(transaction_data);

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, transaction_data),
        ]).then(value =>{
            console.log(value);
            if(value[0].length < this.vm.loadingCount){
                this.vm.loadMoreTransactions = false;
            }
            let transaction_id_data = [];
            value[0].forEach(element =>{
                transaction_id_data.push(element.id);
            })
            let transaction_details_data = {
                'parentTransaction__in': transaction_id_data
            }
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_account_details, transaction_details_data),
                this.vm.accountsService.getObjectList(this.vm.accountsService.transaction_images, transaction_details_data),
            ]).then(data =>{
                console.log(data);
                this.initialiseTransactionData(value[0], data[0], data[1]);
                this.vm.isLoading = false;
            },error =>{
                this.vm.isLoading = false;
            })
            
        }, error =>{
            this.vm.isLoading = false;
        })

    }

    initialiseTransactionData(transactionList, transactionAccounts, transactionImages){
        transactionList.forEach(transaction =>{
            let tempData = {
                debitAccounts: [],
                creditAccounts: [],
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

            transactionAccounts.forEach(account =>{
                if(account.parentTransaction == transaction.id){
                    let tempAccount = this.vm.accountsList.find(acccount => acccount.parentAccount == account.parentAccount);
                    let temp = {
                        accountDbId: tempAccount.parentAccount,
                        account: tempAccount.title,
                        amount: account.amount,
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
            this.vm.transactionsList.push(tempData);

        })
        this.vm.transactionsList.sort((a,b) => { return (b.voucherNumber - a.voucherNumber)});
        console.log(this.vm.transactionsList);
    }

}