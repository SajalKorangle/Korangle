import { ManageAccountsComponent } from './manage-accounts.component'

export class ManageAccountsServiceAdapter {

    vm: ManageAccountsComponent;
    constructor() {}
    // Data

    initializeAdapter(vm: ManageAccountsComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        let request_account_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        }
        this.vm.isLoading = true;


        this.vm.toDisplayList = [];

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.heads, {}),
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),

        ]).then(value =>{
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
                this.initialiseAccountList(value[1], data[0]);
                this.initialiseDisplayData(value[1], data[0]);
                this.vm.isLoading = false;
            }, error =>{
                this.vm.isLoading = false;
            })
        },error =>{
            this.vm.isLoading = false;
        })

    }

    initialiseAccountList(accountList: any, accountSessionList: any){
        this.vm.accountsList = [];
        this.vm.groupsList = [];
        accountSessionList.forEach(account =>{
            let type = accountList.find(accounts => accounts.id == account.parentAccount).accountType;
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


    initialiseDisplayData(accountsList: any, accountsSessionList: any){
        this.vm.toDisplayList = [];
        let parentGroupsList = [];
        let individualAccountList = [];
        // while(accountsSessionList.length > 0){
            for(let i=0;i<accountsSessionList.length; i++){
                let type = accountsList.find(accounts => accounts.id == accountsSessionList[i].parentAccount).accountType;
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
        this.populateHeadDisplayList(parentGroupsList, individualAccountList);

    }

    populateHeadDisplayList(groupsList, accountList){
        this.vm.expensesList = [];
        this.vm.incomeList = [];
        this.vm.assestsList = [];
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
                this.vm.assestsList.push(group);
            }
            else if(head == 'Liabilities'){
                this.vm.liabilityList.push(group);
            }

        })
        accountList.forEach(account =>{
            let head = this.vm.headsList.find(head => head.id == account.parentHead).title;
            if(head == 'Expenses'){
                this.vm.expensesList.push(account);
            }
            else if(head == 'Income'){
                this.vm.incomeList.push(account);
            }
            else if(head == 'Assests'){
                this.vm.assestsList.push(account);
            }
            else if(head == 'Liabilities'){
                this.vm.liabilityList.push(account);
            }

        })
        console.log(this.vm.expensesList);
        console.log(this.vm.incomeList);
        console.log(this.vm.assestsList);
        console.log(this.vm.liabilityList);

    }
    
    

}
