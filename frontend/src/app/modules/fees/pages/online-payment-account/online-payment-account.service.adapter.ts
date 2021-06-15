import { OnlinePaymentAccountComponent } from './online-payment-account.component';

async function sleep() {
    await new Promise(resolve => setTimeout(resolve, 4000));
}

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
            this.vm.feeService.getObjectList(this.vm.feeService.settelment_cycle, {})
                .then(data => data.map(d => {
                    return { ...d, id: parseInt(d.id) };
                })
                ),
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
            this.vm.cache.ifsc = await this.vm.feeService.getObject(this.vm.feeService.ifsc_verification, request_data);
        }
        this.vm.isIFSCLoading = false;
    }

    async createUpdateOnlinePaymentAccount() {
        if (!this.vm.offlineValidation())
            return;

        this.vm.intermediateUpdateState.accountVerificationLoading = true;
        this.vm.intermediateUpdateState.ifscVerificationLoading = true;
        this.vm.intermediateUpdateState.registrationLoading = true;
        this.vm.isLoading = true;

        // await sleep();
        const newOnlinePaymentAccount = this.vm.getRequiredPaymentAccountData();
        console.log('newOnlinePayment Account: ', newOnlinePaymentAccount);
        await this.verifyIFSC();
        if (!this.vm.cache.ifsc) {
            alert('ifsc verification failed');
            this.vm.resetintermediateUpdateState();
            return;
        }
        this.vm.intermediateUpdateState.ifscVerificationLoading = false;
        // await sleep();
        const account_verification_data = {
            accountNumber: this.vm.onlinePaymentAccount.vendorData.bank.accountNumber,
            ifsc: this.vm.onlinePaymentAccount.vendorData.bank.ifsc
        };
        const accountVerificationData = await this.vm.feeService.createObject(this.vm.feeService.bank_account_verification, account_verification_data);
        if (accountVerificationData.accountStatusCode != "ACCOUNT_IS_VALID") {
            alert(`Account verification failed\n message: ${accountVerificationData.message}`);
            this.vm.resetintermediateUpdateState();
            return;
        }
        this.vm.intermediateUpdateState.accountVerificationLoading = false;
        // await sleep();
        if (this.vm.onlinePaymentAccount.id) {
            this.vm.onlinePaymentAccount =
                await this.vm.feeService.updateObject(this.vm.feeService.online_payment_account, newOnlinePaymentAccount);
            this.vm.snackBar.open('Payment Account Updated Successfully', undefined, { duration: 5000 });
        }
        else {
            this.vm.onlinePaymentAccount =
                await this.vm.feeService.createObject(this.vm.feeService.online_payment_account, newOnlinePaymentAccount);
            this.vm.snackBar.open('Payment Account Created Successfully', undefined, { duration: 5000 });
        }
        this.vm.resetintermediateUpdateState();
    }




}