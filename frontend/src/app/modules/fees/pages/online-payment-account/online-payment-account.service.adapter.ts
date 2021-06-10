
import { OnlinePaymentAccountComponent } from './online-payment-account.component';

export class OnlinePaymentAccountServiceAdapter {

    vm: OnlinePaymentAccountComponent;

    constructor() { }

    // Data
    currentSchoolDetails: any;

    initializeAdapter(vm: OnlinePaymentAccountComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.feeService.getObject(this.vm.feeService.online_payment_account, { parentSchool: this.vm.user.activeSchool.dbId }).then(value => {
            console.log('School online payment account details ');
            console.dir(value);
            console.log(value.data == undefined);
            if (value.data != undefined) {
                this.vm.schoolExistingAccount = true;
                this.vm.school.name = value.data.name;
                this.vm.school.email = value.data.email;
                this.vm.school.phone = value.data.phone;
                this.vm.school.aadharNo = value.data.aadharNo;
                this.vm.school.panNo = value.data.panNo;
                this.vm.school.bankAccount = value.data.bankAccount;
                this.vm.school.ifsc = value.data.ifsc;
                this.vm.school.accountHolder = value.data.accountHolder;
                this.vm.school.gstin = value.data.gstin;
                this.vm.school.status = value.data.status;
            }

        });
    }



}