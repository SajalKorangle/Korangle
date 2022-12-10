import { SettingsComponent } from './settings.component';

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() {}

    initializeAdapter(vm: SettingsComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        const lock_accounts_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        const employee_amount_permission_request = {
            parentEmployee__parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.lock_accounts, lock_accounts_data),
            this.vm.accountsService.getObjectList(this.vm.accountsService.employee_amount_permission, employee_amount_permission_request),
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 2
        ]).then(value => {
            this.vm.backendData.employeeAmountPermissionList = value[1];
            if (value[0].length == 0) {
                this.vm.lockAccounts = null;
            } else if (value[0].length == 1) {
                this.vm.lockAccounts = value[0][0];
            } else {
                alert('Error: Report admin');
            }
            this.vm.currentSession = value[2].find(session => session.id == this.vm.user.activeSchool.currentSessionDbId);
            this.vm.isLoading = false;
        });
    }

    changeAmountRestriction(): any {
        this.vm.isLoading = true;
        if (this.vm.selectedEmployeeAccountPermission) {
            let tempData = {
                id: this.vm.selectedEmployeeAccountPermission.id,
                restrictedAmount: this.vm.selectedEmployeeAmount,
            };
            Promise.all([
                this.vm.accountsService.partiallyUpdateObject(this.vm.accountsService.employee_amount_permission, tempData),
            ]).then(value => {
                this.vm.selectedEmployeeAccountPermission.restrictedAmount = value[0].restrictedAmount;
                this.vm.isLoading = false;
            });
        }
        else {
            let tempData = {
                parentEmployee: this.vm.selectedEmployee.id,
                restrictedAmount: this.vm.selectedEmployeeAmount,
            };
            Promise.all([
                this.vm.accountsService.createObject(this.vm.accountsService.employee_amount_permission, tempData),
            ]).then(value => {
                this.vm.backendData.employeeAmountPermissionList.push(value[0]);
                this.vm.selectedEmployeeAccountPermission = value[0];
                this.vm.isLoading = false;
            });
        }

    }

    regenerateVoucherNumber(): any {
        this.vm.isLoading = true;
        let voucherNumber = 1;
        let transaction_data = {
            'parentEmployee__parentSchool': this.vm.user.activeSchool.dbId,
            'transactionDate__gte': this.vm.currentSession.startDate,
            'transactionDate__lte': this.vm.currentSession.endDate,
            'korangle__order': 'id',
            'fields__korangle': 'id,voucherNumber'
        };
        Promise.all([
            this.vm.accountsService.getObjectList(this.vm.accountsService.transaction, transaction_data),
        ]).then(value => {
            let toUpdateList = [];
            value[0].forEach(element => {
                let tempData = {
                    'id': element.id,
                    'voucherNumber': voucherNumber,
                };

                if (element.voucherNumber != voucherNumber) { // if voucherNumber is aleady same (edundent update handeled)
                    toUpdateList.push(tempData);
                }
                voucherNumber = voucherNumber + 1;
            });
            Promise.all([
                this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.transaction, toUpdateList),
            ]).then(val => {
                this.vm.isLoading = false;
                alert('Voucher Number Regenerated Successfully');
            });
        });
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
        });

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
