import { SetBankAccountComponent } from './set-bank-account.component';
import { CommonFunctions } from '@classes/common-functions';
export class SetBankAccountServiceAdapter {

    vm: SetBankAccountComponent;

    constructor() { }

    // Data
    currentSchoolDetails: any;

    initializeAdapter(vm: SetBankAccountComponent): void {
        this.vm = vm;

    }

    //initialize data
    async initializeData() {
        let schoolMerchantAccount;
        /*[
            schoolMerchantAccount,
            this.vm.settlementCycleList,
        ] = await Promise.all([
            this.vm.paymentService.getObject(this.vm.paymentService.school_merchant_account, {}),
            this.vm.paymentService.getObjectList(this.vm.paymentService.settlement_cycle, {})
                .then(data => data.map(d => {
                    return { ...d, id: parseInt(d.id) };
                })
                ),
        ]);*/

        [
            schoolMerchantAccount, // 0
            this.vm.settlementCycleList, // 1
            this.vm.backendData.schoolBankAccountUpdationPermissionCountList, // 2
        ] = await Promise.all([
            this.vm.paymentService.getObject(this.vm.paymentService.school_merchant_account, {}), // 0
            this.vm.paymentService.getObjectList(this.vm.paymentService.settlement_cycle, {})
                .then(data => data.map(d => {
                    return { ...d, id: parseInt(d.id) };
                })
            ), // 1
            this.vm.genericService.getObjectList(
                {payment_app: 'SchoolBankAccountUpdationPermissionCount'},
                {filter: {parentSchool: this.vm.user.activeSchool.dbId}}
            ), // 2
        ]);

        if (schoolMerchantAccount) {
            this.vm.schoolMerchantAccount = schoolMerchantAccount;
            this.getBankDetailsFromIFSC();
        }
        this.vm.isLoading = false;
    }

    async getBankDetailsFromIFSC() {
        this.vm.isIFSCLoading = true;
        if (this.vm.schoolMerchantAccount.vendorData.bank.ifsc.length == 11
            && !this.vm.isIFSCValidationPasses()) {

            const request_data = {
                ifsc: this.vm.schoolMerchantAccount.vendorData.bank.ifsc
            };
            this.vm.cache.bankDetails = await this.vm.paymentService.getObject(this.vm.paymentService.ifsc_verification, request_data);
        }
        this.vm.isIFSCLoading = false;
    }

    getRequiredPaymentAccountData() {
        const requiredOnlyFields = CommonFunctions.getInstance().deepCopy(this.vm.schoolMerchantAccount);
        delete requiredOnlyFields.vendorData.addedOn;
        delete requiredOnlyFields.vendorData.balance;
        delete requiredOnlyFields.vendorData.status;
        delete requiredOnlyFields.vendorData.upi;
        requiredOnlyFields.vendorData.settlementCycleId = parseInt(requiredOnlyFields.vendorData.settlementCycleId.toString());
        return requiredOnlyFields;
    }

    async createUpdateOnlinePaymentAccount() {
        if (!this.vm.isDataValid())
            return;

        this.vm.intermediateUpdateState.accountVerificationLoading = true;
        this.vm.intermediateUpdateState.ifscVerificationLoading = true;
        this.vm.intermediateUpdateState.registrationLoading = true;
        this.vm.isLoading = true;

        const newOnlinePaymentAccount = this.getRequiredPaymentAccountData();
        await this.getBankDetailsFromIFSC();
        if (!this.vm.isIFSCValidationPasses()) {
            alert('ifsc verification failed');
            this.vm.resetIntermediateUpdateState();
            return;
        }
        this.vm.intermediateUpdateState.ifscVerificationLoading = false;

        const account_verification_data = {
            accountNumber: this.vm.schoolMerchantAccount.vendorData.bank.accountNumber,
            ifsc: this.vm.schoolMerchantAccount.vendorData.bank.ifsc
        };
        const accountVerificationData = await this.vm.paymentService.createObject(this.vm.paymentService.bank_account_verification, account_verification_data);
        if (accountVerificationData.accountStatusCode != "ACCOUNT_IS_VALID") {
            alert(`Account verification failed\n message: ${accountVerificationData.message}`);
            this.vm.resetIntermediateUpdateState();
            return;
        }
        this.vm.intermediateUpdateState.accountVerificationLoading = false;

        // Reducing School Bank Account Updation Permission Count by 1 before account updation starts
        this.vm.backendData.schoolBankAccountUpdationPermissionCountList[0].bankAccountUpdationPermissionCount -= 1;
        await this.vm.genericService.updateObject(
            {payment_app: 'SchoolBankAccountUpdationPermissionCount'},
            this.vm.backendData.schoolBankAccountUpdationPermissionCountList[0]
        );
        // Reducing School Bank Account Updation Permission Count by 1 before account updation ends

        if (this.vm.schoolMerchantAccount.id) {
            let res = await this.vm.paymentService.updateObject(this.vm.paymentService.school_merchant_account, newOnlinePaymentAccount);
            if (res) {
                this.vm.schoolMerchantAccount = res;
                this.vm.snackBar.open(
                    'Successfully requested for your updating Payment Account, please give us some time to approve these changes.',
                    undefined, { duration: 5000 }
                );
            }
        }
        else {
            let res = await this.vm.paymentService.createObject(this.vm.paymentService.school_merchant_account, newOnlinePaymentAccount);
            if (res) {
                this.vm.schoolMerchantAccount = res;
                this.vm.snackBar.open(
                    'Successfully requested for creating your Payment Account, please give us some time to approve your account.',
                    undefined, { duration: 5000 }
                );
            }
        }

        this.vm.resetIntermediateUpdateState();
    }




}