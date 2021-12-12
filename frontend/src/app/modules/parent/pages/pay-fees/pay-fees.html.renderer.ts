import { PayFeesComponent } from './pay-fees.component';
import { KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE } from '@modules/fees/classes/constants';


export class PayFeesHTMLRenderer {
    vm: PayFeesComponent;

    constructor(vm: PayFeesComponent) {
        this.vm = vm;
    }

    isOnlinePaymentEnabled() {
        return this.vm.schoolMerchantAccount && this.vm.schoolMerchantAccount.isEnabled;
    }

    getParentPlatformFeePercentage() {
        const processingChargeOnParent = KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE - this.getSchoolPlatformFeePercentage();
        return (100 * processingChargeOnParent) / (100 - processingChargeOnParent);   // new platform fee
    }

    getSchoolPlatformFeePercentage() {
        return (this.vm.schoolMerchantAccount.percentageOfPlatformFeeOnSchool * KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE) / 100;
    }

}