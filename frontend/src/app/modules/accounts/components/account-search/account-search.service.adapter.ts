
import {AccountSearchComponent} from "./account-search.component";

export class AccountSearchServiceAdapter {

    vm: AccountSearchComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: AccountSearchComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        let request_account_data = {
            parentSchool: this.vm.user.activeSchool.dbId,

        };
        this.vm.isLoading = true;

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, request_account_data),

        ]).then(value => {
            let account_session_data = [];
            value[0].forEach(account => {
                account_session_data.push(account.id);
            });
            let request_account_session_data = {
                'parentAccount__in': account_session_data,
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            };
            Promise.all([
                this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, request_account_session_data),
            ]).then(data => {
                this.initialiseAccountList(value[0], data[0]);
                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            });
        }, error => {
            this.vm.isLoading = false;
        });


    }

    initialiseAccountList(accountList: any, accountSessionList: any) {
        this.vm.accountsList = [];
        accountSessionList.forEach(account => {
            let acc = accountList.find(accounts => accounts.id == account.parentAccount);
            account['type'] = acc.accountType;
            account['title'] = acc.title;
            if (acc.accountType == 'ACCOUNT' || (acc.accountType == 'GROUP' && this.vm.includeGroup == true)) {
                this.vm.accountsList.push(account);
            }
        });
        return ;
    }

}
