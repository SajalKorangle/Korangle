import { TransferBalanceComponent } from './transfer-balance.component' 
import { HEADS_LIST } from './../../classes/constants'
import { element } from 'protractor';
import { copyFileSync } from 'fs';

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
            this.initialiseDisplayData(this.currentAccountsSessionList, this.vm.currentSessionAccountsList);
            this.initialiseDisplayData(this.nextAccountsSessionList, this.vm.nextSessionAccountsList);
            this.vm.isLoading =  false;
        })
    }


    populateAccountSessionList(currentAccountsSessionList, nextAccountsSessionList){
        for(let i=0;i<currentAccountsSessionList.length ; i++){
            let account = currentAccountsSessionList[i];
            let acc = this.accountsList.find(accounts => accounts.id == account.parentAccount);
            account['type'] = acc.accountType;
            account['title'] = acc.title;
            account['selected'] = false;
            account['disabled'] = false;
            let nextSessionAccount = nextAccountsSessionList.find(acc => acc.parentAccount == account.parentAccount);
            if(nextSessionAccount != undefined && acc.accountType == 'ACCOUNT'){
                if(account.parentHead == 1 || account.parentHead == 2){
                    account['disabled'] = true;
                }
                else if(account.balance == nextSessionAccount.balance){
                    account['disabled'] = true;
                }
            }
            else if(nextSessionAccount != undefined && acc.accountType == 'GROUP'){
                account['disabled'] = true;
            }
            this.vm.currentSessionSelectedAccountsList.push(account);
        }
        console.log(this.vm.currentSessionSelectedAccountsList);
    }


    initialiseDisplayData(toPopulateAccountsSessionList, list){
        let accountsSessionList = JSON.parse(JSON.stringify(toPopulateAccountsSessionList));
        let parentGroupsList = [];
        let individualAccountList = [];
        for(let i=0;i<accountsSessionList.length; i++){
            // let type = this.accountsList.find(accounts => accounts.id == accountsSessionList[i].parentAccount).accountType;
            // accountsSessionList[i]['type'] = type;
            let acc = this.accountsList.find(accounts => accounts.id == accountsSessionList[i].parentAccount);
            accountsSessionList[i]['type'] = acc.accountType;
            accountsSessionList[i]['title'] = acc.title;
            if(acc.accountType == 'ACCOUNT'){
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
        for(let i=0;i<accountsSessionList.length; i++){    // the left out data in accountsSessionList are those groups which have no account as child
            accountsSessionList[i]['childs'] = [];
            parentGroupsList.push(accountsSessionList[i]);
        }
        for(let i=0; i<parentGroupsList.length; i++){      // populating groups in their parent group to create hierarchial data 
           
            if(parentGroupsList[i].parentGroup != null){
                parentGroupsList.find(gro => gro.parentAccount == parentGroupsList[i].parentGroup).childs.push(parentGroupsList[i]);
            }
        }

        for(let i=0; i<parentGroupsList.length; i++){          // we need only those groups/accounts that have no parent group, as the rest are populated inside them
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
        console.log('res', list);
    }

    transferAccounts(){
        this.vm.isLoading = true;
        let toCreateList = [];
        let toUpdateList = [];
        this.vm.currentSessionSelectedAccountsList.forEach(element =>{
            if(element.selected){
                let nextSessionAccount = this.nextAccountsSessionList.find(acc => acc.parentAccount == element.parentAccount);
                if(nextSessionAccount == undefined){
                    let temp_data = {
                        parentAccount: element.parentAccount,
                        parentGroup: element.parentGroup,
                        parentHead: element.parentHead,
                        parentSession: this.vm.user.activeSchool.currentSessionDbId+1,
                        balance: null,
                    }
                    if(element.type == 'ACCOUNT'){
                        if(element.parentHead == 1 || element.parentHead == 2){
                            temp_data.balance = 0;
                        }
                        else if(element.parentHead == 3 || element.parentHead == 4){
                            temp_data.balance = element.balance;
                        }
                    }
                    toCreateList.push(temp_data);
                }
                else{
                    if(!element.disabled){
                        let temp_data = {
                            id: nextSessionAccount.id,
                            balance: element.balance,
                        }
                        toUpdateList.push(temp_data);
                    }
                }

            }
            
        })
        Promise.all([
            this.vm.accountsService.createObjectList(this.vm.accountsService.account_session, toCreateList),
            this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.account_session, toUpdateList),
        ]).then(val =>{

            for(let i=0;i<val[0].length ; i++){
                this.nextAccountsSessionList.push(val[0][i]);
            }
            for(let i=0;i<val[1].length; i++){
                this.nextAccountsSessionList.find(element => element.id == val[1][i].id ).balance = val[1][i].balance;
            }
            this.populateAccountSessionList(this.currentAccountsSessionList,this.nextAccountsSessionList);
            this.initialiseDisplayData(this.currentAccountsSessionList, this.vm.currentSessionAccountsList);
            this.initialiseDisplayData(this.nextAccountsSessionList, this.vm.nextSessionAccountsList);
            this.vm.deSelectAllAccounts();
            alert('Balance Transferred Successfully')
            this.vm.isLoading = false;
            
        },error =>{
            this.vm.isLoading = false;
        })

    }


}