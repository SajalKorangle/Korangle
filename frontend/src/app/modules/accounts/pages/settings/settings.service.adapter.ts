import { SettingsComponent } from './settings.component'

export class SettingsServiceAdapter {

    vm: SettingsComponent;
    constructor() {}
    dbId: any;
    // Data

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;
        this.vm.isLoading = true;
        this.vm.isUpdating = true;

        let lock_accounts_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.accountsService.getObjectList(this.vm.accountsService.lock_accounts, lock_accounts_data).then(value => {

            if (value.length == 0) {
                this.vm.lockAccounts = null;
            } else if (value.length == 1) {
                this.vm.lockAccounts = value[0];
            } else {
                alert('Error: Report admin');
            }

            this.vm.isInitialLoading = false;
            this.vm.isLoading = false;
            this.vm.isUpdating = false;

        }, error => {
            this.vm.isInitialLoading = false;
            this.vm.isLoading = false;
            this.vm.isUpdating = false;
        })
    }
    
    getEmployeeAmount(employee: any): void{
        this.vm.isLoading = true;
        let employee_data = {
            parentEmployee: employee.id,
        }
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
        ]).then(value =>{
            this.vm.minimumDate = value[1].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).startDate;  // change for current session
            this.vm.maximumDate = value[1].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId).endDate;
            console.log(value);
            if(value[0].length > 0){
                this.vm.selectedEmployeeAmount = value[0][0].restrictedAmount;
                this.dbId = value[0][0].id;
            }
            else{
                this.vm.selectedEmployeeAmount = null;
                this.dbId = null;
            }
            this.vm.selectedEmployee = employee.id;
            this.vm.isLoading = false;
        })
    }

    changeAmountRestriction(): any{
        this.vm.isUpdating = true;
        if(this.dbId == null){
            let tempData = {
                parentEmployee: this.vm.selectedEmployee,
                restrictedAmount: this.vm.selectedEmployeeAmount,
            }
            console.log(tempData);
            Promise.all([
                this.vm.accountsService.createObject(this.vm.accountsService.employee_amount_permission, tempData),
            ]).then(value =>{
                this.dbId = value[0].id;
                this.vm.isUpdating = false;
            })
        }
        else{
            let tempData = {
                id: this.dbId,
                restrictedAmount: this.vm.selectedEmployeeAmount,
            }
            console.log(tempData);
            Promise.all([
                this.vm.accountsService.partiallyUpdateObject(this.vm.accountsService.employee_amount_permission, tempData),
            ]).then(value =>{
                this.vm.isUpdating = false;
            })
        }

    }

    regenerateVoucherNumber(): any{
        this.vm.isUpdating = true;
        let voucherNumber = 1;
        let transaction_data = {
            'parentEmployee__parentSchool': this.vm.user.activeSchool.dbId,            
            'transactionDate__gte': this.vm.minimumDate,
            'transactionDate__lte': this.vm.maximumDate,
            'korangle__order': 'id',
            'fields__korangle': 'id,voucherNumber'
        }
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, transaction_data),
        ]).then(value =>{
            console.log(value);
            let toUpdateList = [];
            value[0].forEach(element =>{
                let tempData = {
                    'id': element.id,
                    'voucherNumber': voucherNumber,
                }
                
                if(element.voucherNumber != voucherNumber){
                    toUpdateList.push(tempData);
                }
                voucherNumber = voucherNumber + 1;
            })
            console.log(toUpdateList);
            Promise.all([
                this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.transaction, toUpdateList),
            ]).then(val =>{
                console.log(val);
                this.vm.isUpdating = false;
                alert('Voucher Number Regenerated Successfully');
            })
        })
    }

    lockAccounts(): void {

        this.vm.isLoading = true;

        let lock_accounts_object = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.accountsService.createObject(this.vm.accountsService.lock_accounts, lock_accounts_object).then(value => {

            alert('Accounts locked successfully');

            this.vm.lockAccounts = value;

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        })

    }

    unlockAccounts(): void {

        this.vm.isLoading = true;

        this.vm.accountsService.deleteObject(this.vm.accountsService.lock_accounts, this.vm.lockAccounts).then(value => {

            alert('Accounts unlocked successfully');

            this.vm.lockAccounts = null;

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }
    
    
    

}
