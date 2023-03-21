import { SettingsComponent } from './settings.component';
import { DataStorage } from '@classes/data-storage';
// import { KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE } from '@modules/fees/classes/constants';

export class SettingsHtmlRenderer {

    isEasebuzzInPayFeesFeatureFlagEnabled: boolean;

    constructor(public vm: SettingsComponent) { 
        this.isEasebuzzInPayFeesFeatureFlagEnabled = DataStorage.getInstance().isFeatureEnabled("Easebuzz in Pay Fees page feature flag");
    }

    getParentPlatformFeePercentage() {
        return 100 - this.getSchoolPlatformFeePercentage();  // new platform charge
    }

    getSchoolPlatformFeePercentage() {
        return this.vm.backendData.schoolMerchantAccount.percentageOfPlatformFeeOnSchool;
    }

    isUpdatingOnlineFeePaymentAllowed() {
        if (this.isEasebuzzInPayFeesFeatureFlagEnabled) {
            return this.vm.backendData.schoolMerchantAccount.isAllowed;
        }
        return true;
    }
    forcePositiveNumber(event: any) {
        if (event.target.value !== "") {
            event.target.value = Math.max(0, event.target.value);
        }
        if (event.target.value === "") {
            event.target.value = "";
        }
    }
}