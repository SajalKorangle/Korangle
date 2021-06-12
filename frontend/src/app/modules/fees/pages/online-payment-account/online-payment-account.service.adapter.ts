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
    async initializeData() {
        let onlinePaymentAccount;
        [
            onlinePaymentAccount,
            this.vm.settelmentCycleList,
        ] = await Promise.all([
            this.vm.feeService.getObject(this.vm.feeService.online_payment_account, {}),
            this.vm.feeService.getObjectList(this.vm.feeService.settelment_cycle, {}),
        ]);

        if (onlinePaymentAccount) {
            this.vm.onlinePaymentAccount = onlinePaymentAccount;
        }
        this.vm.isLoading = false;
    }


    async createOnlinePaymentAccount() {
        this.vm.isLoading = true;
        let newOnlinePaymentAccount = this.vm.removeNullKeys(this.vm.onlinePaymentAccount);
        this.vm.onlinePaymentAccount =
            await this.vm.feeService.createObject(this.vm.feeService.online_payment_account, newOnlinePaymentAccount);
        this.vm.isLoading = false;
        this.vm.snackBar.open('Payment Account Created Successfullt', undefined, { duration: 5000 });
    }




}