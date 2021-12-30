import { SettingsComponent } from './settings.component';
import { KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE } from '@modules/fees/classes/constants';

export class SettingsHtmlRenderer {

    constructor(public vm: SettingsComponent) { }

    getParentPlatformFeePercentage() {
        const absoluteProcessingChargeOnParent = KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE - this.getSchoolPlatformFeePercentage();
        return (100 * absoluteProcessingChargeOnParent) / (100 - absoluteProcessingChargeOnParent);  // new platform charge
    }

    getSchoolPlatformFeePercentage() {
        return (this.vm.backendData.schoolMerchantAccount.percentageOfPlatformFeeOnSchool * KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE) / 100;
    }

}