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

    async verifyIFSC() {
        this.vm.isIFSCLoading = true;
        if (this.vm.onlinePaymentAccount.vendorData.bank.ifsc.length == 11
            && (!this.vm.cache.ifsc || this.vm.cache.ifsc.ifsc != this.vm.onlinePaymentAccount.vendorData.bank.ifsc)) {

            const request_data = {
                ifsc: this.vm.onlinePaymentAccount.vendorData.bank.ifsc
            };
            const ifsc_data = await this.vm.feeService.getObject(this.vm.feeService.ifsc_verification, request_data);
            if (ifsc_data) {
                this.vm.cache.ifsc = ifsc_data;
            }
        }
        this.vm.isIFSCLoading = true;
    }

    async createUpdateOnlinePaymentAccount() {
        if (!this.vm.offlineValidation())
            return;
        this.vm.intermediateUpdateState.accountVerificationLoading = true;
        this.vm.intermediateUpdateState.ifscVerificationLoading = true;
        this.vm.intermediateUpdateState.registrationLoading = true;
        this.vm.isLoading = true;
        let newOnlinePaymentAccount = this.vm.removeNullKeys(this.vm.onlinePaymentAccount);
        // this.vm.onlinePaymentAccount =
        //     await this.vm.feeService.createObject(this.vm.feeService.online_payment_account, newOnlinePaymentAccount);
        // this.vm.isLoading = false;
        // this.vm.snackBar.open('Payment Account Created Successfullt', undefined, { duration: 5000 });
    }




}