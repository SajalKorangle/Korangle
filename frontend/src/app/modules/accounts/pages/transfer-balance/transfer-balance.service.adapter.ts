import { TransferBalanceComponent } from './transfer-balance.component' 

export class TransferBalanceServiceAdapter{

    vm: TransferBalanceComponent;
    constructor() {}
    // Data
    currentAccountsSessionList: any;
    nextAccountsSessionList: any;
    accountsList: any;

    initializeAdapter(vm: TransferBalanceComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        
        this.vm.isLoading = true;
        let accounts_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        }

        let current_session_accounts_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        }

        let next_session_accounts_data = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId+1,
        }

        Promise.all([
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, accounts_data),
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, current_session_accounts_data),
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, next_session_accounts_data),
        ]).then(value =>{
            this.vm.currentSession = value[0].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
            this.vm.nextSession = value[0].find(session => session.id == (this.vm.user.activeSchool.currentSessionDbId + 1));
            this.vm.selectedSession = this.vm.currentSession; 
            this.accountsList =  value[1];
            this.currentAccountsSessionList = value[2];
            this.nextAccountsSessionList = value[3];
            this.populateAccountSessionList(value[2], value[3]);
            // this.populateAccountsSessionList(value[1], value[3], this.vm.nextSessionAccountsList);
            this.initialiseDisplayData(this.currentAccountsSessionList, this.vm.currentSessionAccountsList);
            this.initialiseDisplayData(this.nextAccountsSessionList, this.vm.nextSessionAccountsList);
            this.vm.isLoading =  false;
        })
    }


    populateAccountSessionList(currentAccountsSessionList, nextAccountsSessionList){
        for(let i=0;i<currentAccountsSessionList.length ; i++){
            let account = currentAccountsSessionList[i];
            let type = this.accountsList.find(accounts => accounts.id == account.parentAccount).accountType;
            account['type'] = type;
            account['selected'] = false;
            account['disabled'] = true;
            let nextSessionAccount = nextAccountsSessionList.find(acc => acc.parentAccount == account.parentAccount);
            if(nextSessionAccount != undefined && type == 'ACCOUNT'){
                if(account.parentHead == 1 || account.parentHead == 2){
                    account['disabled'] = true;
                }
                else if(account.balance == nextSessionAccount.balance){
                    account['disabled'] = true;
                }
            }
            this.vm.currentSessionSelectedAccountsList.push(account);
        }
    }


    initialiseDisplayData(toPopulateAccountsSessionList, list){
        let accountsSessionList = JSON.parse(JSON.stringify(toPopulateAccountsSessionList));
        let parentGroupsList = [];
        let individualAccountList = [];
        // while(accountsSessionList.length > 0){
            for(let i=0;i<accountsSessionList.length; i++){
                let type = this.accountsList.find(accounts => accounts.id == accountsSessionList[i].parentAccount).accountType;
                accountsSessionList[i]['type'] = type;
                accountsSessionList[i]['selected'] = true;
                if(type == 'ACCOUNT'){
                    if(accountsSessionList[i].parentGroup == null){
                        individualAccountList.push(accountsSessionList[i]);
                        accountsSessionList.splice(i,1);
                        i--;
                    }
                    else{
                        let tempGroup = parentGroupsList.find(group => group.parentAccount == accountsSessionList[i].parentGroup);
                        if(tempGroup == undefined){
                            let parentGroupIndex =  accountsSessionList.map(function(e) { return e.parentAccount; }).indexOf(accountsSessionList[i].parentGroup);
                            let parentGroupData = JSON.parse(JSON.stringify(accountsSessionList[parentGroupIndex]));
                            
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
                            tempGroup.childs.push(accountsSessionList[i]);
                            accountsSessionList.splice(i,1);
                            i--;
                        }
                    }
                }
            }
        // }

        for(let i=0;i<accountsSessionList.length; i++){    // the left out data in accountsSessionList are those groups which have no child
            accountsSessionList[i]['selected'] = false;
            parentGroupsList.push(accountsSessionList[i]);
        }
        
        for(let i=0; i<parentGroupsList.length; i++){      // populating groups in their parent group to create hierarchial data 
           
            if(parentGroupsList[i].parentGroup != null){
                parentGroupsList.find(gro => gro.parentAccount == parentGroupsList[i].parentGroup).childs.push(parentGroupsList[i]);
            }
            
        }

        for(let i=0; i<parentGroupsList.length; i++){          // we need only those groups/accounts that have no parent group, as they are populated inside them
            if(parentGroupsList[i].parentGroup != null){
                parentGroupsList.splice(i, 1);
                i--;
            }
        }
        this.populateHeadWiseDisplayList(parentGroupsList, individualAccountList, list);

    }

    populateHeadWiseDisplayList(groupsList, individualAccountList, list){
        list['Expenses'] = [];
        list['Income'] = [];
        list['Assets'] = [];
        list['Liabilities'] = [];
        groupsList.forEach(group =>{
            let head = this.vm.headsList.find(head => head.id == group.parentHead).title;
            if(head == 'Expenses'){
                list['Expenses'].push(group);
            }
            else if(head == 'Income'){
                list['Income'].push(group);
            }
            else if(head == 'Assets'){
                list['Assets'].push(group);
            }
            else if(head == 'Liabilities'){
                list['Liabilities'].push(group);
            }

        })
        individualAccountList.forEach(account =>{
            let head = this.vm.headsList.find(head => head.id == account.parentHead).title;
            if(head == 'Expenses'){
                list['Expenses'].push(account);
            }
            else if(head == 'Income'){
                list['Income'].push(account);
            }
            else if(head == 'Assets'){
                list['Assets'].push(account);
            }
            else if(head == 'Liabilities'){
                list['Liabilities'].push(account);
            }

        })

    }

}