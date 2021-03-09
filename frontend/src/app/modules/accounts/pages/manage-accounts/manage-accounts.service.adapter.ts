import { ManageAccountsComponent } from './manage-accounts.component'

export class ManageAccountsServiceAdapter {

    vm: ManageAccountsComponent;
    constructor() {}
    // Data

    initializeAdapter(vm: ManageAccountsComponent): void {
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



        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),

        ]).then(value =>{
            
            this.vm.minimumDate = value[1].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).startDate;  // change for current session
            this.vm.maximumDate = value[1].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).endDate;
            
            let account_id_list = [];
            value[0].forEach(account =>{
                account_id_list.push(account.id);
            })
            let request_account_session_data = {
                'parentAccount__in': account_id_list,
                'parentSession': this.vm.user.activeSchool.currentSessionDbId, 
            }
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),
            ]).then(data =>{
                console.log(data);
                this.accountsList = value[0];
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
            let acc = this.accountsList.find(accounts => accounts.id == account.parentAccount);
            account['type'] = acc.accountType;
            account['title'] = acc.title;
            if(acc.accountType == 'ACCOUNT'){
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
