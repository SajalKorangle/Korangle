import { ManageAccountsComponent } from './manage-accounts.component'
import { Account } from './../../../../services/modules/accounts/models/account';
import { AccountSession } from './../../../../services/modules/accounts/models/account-session';

export class ManageAccountsServiceAdapter {

    vm: ManageAccountsComponent;
    constructor() {}
    // Data

    initializeAdapter(vm: ManageAccountsComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        const lock_accounts_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.accountsService.getObjectList(this.vm.accountsService.lock_accounts, lock_accounts_data).then(value=>{
            if (value.length == 1) {
                this.vm.lockAccounts = true;
                this.vm.isLoading = false;
            } else if (value.length == 0) {

                const request_account_data = {
                    parentSchool: this.vm.user.activeSchool.dbId,
                };

                const request_account_session_data = {
                    'parentAccount__parentSchool': this.vm.user.activeSchool.dbId,
                    'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                }

                Promise.all([
                    this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),  // 0
                    this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),   // 1
                    this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 2
                ]).then(value => {
                    
                    const currentSession = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId)
                    this.vm.minimumDate = currentSession.startDate;  // change for current session
                    this.vm.maximumDate = currentSession.endDate;

                    this.initialiseAccountGroupList(value[1], value[0]);
                    this.initialiseDisplayData();
                    this.vm.isLoading = false;
 
                });
            }
            else{
                this.vm.isLoading=false;
                alert("Unexpected errors. Please contact admin");
            }
        });
    }

    initialiseAccountGroupList(accountSessionList: Array<AccountSession>, accountList: Array<Account>): void {
        this.vm.accountsList = [];
        this.vm.groupsList = [];
        accountSessionList.forEach(accountSession => {
            let acc = accountList.find(account => account.id == accountSession.parentAccount);
            const customAccount = { ...accountSession, type: acc.accountType, title: acc.title };
            if (acc.accountType == 'ACCOUNT') {
                this.vm.accountsList.push(customAccount);
            }
            else {
                this.vm.groupsList.push(customAccount);
            }
        });
    }


    initialiseDisplayData(){
        let accountsSessionList = JSON.parse(JSON.stringify(this.accountsSessionList));
        let parentGroupsList = [];
        let individualAccountList = [];
        for(let i=0;i<accountsSessionList.length; i++){
            // let type = this.accountsList.find(accounts => accounts.id == accountsSessionList[i].parentAccount).accountType;
            // accountsSessionList[i]['type'] = type;
            let acc = this.accountsList.find(accounts => accounts.id == accountsSessionList[i].parentAccount);
            accountsSessionList[i]['type'] = acc.accountType;
            accountsSessionList[i]['title'] = acc.title;
            if(acc.accountType == 'ACCOUNT'){
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

        for(let i=0;i<accountsSessionList.length; i++){
            accountsSessionList[i]['childs'] = [];
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
        console.log(individualAccountList);
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
            else if(head == 'Assets'){
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
            else if(head == 'Assets'){
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
    
    

}
