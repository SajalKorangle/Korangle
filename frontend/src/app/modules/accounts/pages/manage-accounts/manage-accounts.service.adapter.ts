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

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.heads, {}),
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),

        ]).then(value =>{
            this.vm.headsList = value[0];
            console.log(value);
            let account_session_data = [];
            value[1].forEach(account =>{
                account_session_data.push(account.id);
            })
            let request_account_session_data = {
                'parentAccount__in': account_session_data,
                'parentSession': this.vm.user.activeSchool.currentSessionDbId, 
            }
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),
            ]).then(data =>{
                this.initialiseAccountList(value[1], data[0]);
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
        console.log(this.vm.accountsList);
        console.log(this.vm.groupsList);
        return ;
    }


    
    

}
