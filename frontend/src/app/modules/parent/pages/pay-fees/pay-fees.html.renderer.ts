type ModeOfPayment = {
    id: number,
    name: string,
    parentPaymentGateway: number,
    apiCode: string,
    parentPaymentGatewayInstance: PaymentGateway,
    modeofpaymentcharges: ModeOfPaymentCharges[],
};

type PaymentGateway = {
    id: number,
    name: string,
};

type ModeOfPaymentCharges = {
    id: number,
    parentModeOfPayment: number,
    chargeType: string,
    charge: number,
    minimumAmount: number,
    maximumAmount: number,
};

import { PayFeesComponent } from './pay-fees.component';
import { DataStorage } from '@classes/data-storage';
import { KORANGLE_ONLINE_PAYMENT_PLATFORM_FEE_PERCENTAGE } from '@modules/fees/classes/constants';

let GST = 0.18;

export class PayFeesHTMLRenderer {
    vm: PayFeesComponent;
    isEasebuzzEnabled: boolean;
    modeOfPaymentList: ModeOfPayment[];
    selectedModeOfPayment: ModeOfPayment;
    korangle_charge = 5.9;

    constructor(vm: PayFeesComponent) {
        this.vm = vm;
        this.isEasebuzzEnabled = DataStorage.getInstance().isFeatureEnabled("Easebuzz in Pay Fees page feature flag")
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

    getNewMethodTotalPlatformCharge(){
        let transaction_amount = 0,
            modeOfPayment = this.selectedModeOfPayment,
            amount = this.vm.getTotalPaymentAmount();
        if (amount === 0) {
            return 0;
        }
        modeOfPayment.modeofpaymentcharges.every(charge => {
            transaction_amount = 0;
            if (charge.chargeType == 'Flat') {
                transaction_amount =
                    parseFloat((
                        amount +
                        this.korangle_charge +
                        Number(charge.charge)*(1+GST)
                    ).toFixed(2));
            } else if (charge.chargeType == 'Percentage') {
                transaction_amount =
                    parseFloat((
                        (amount + this.korangle_charge) * 100
                        /
                        (100 - (charge.charge*(1+GST)))
                    ).toFixed(2));
            }
            if (transaction_amount >= charge.minimumAmount
                && (charge.maximumAmount == -1
                    || transaction_amount <= charge.maximumAmount)) {
                return false;
            }
            return true;
        });
        return parseFloat((transaction_amount - amount).toFixed(2));
    }
    getNewMethodPlatformChargeOnParent() {
        let totalPlatformCharges = this.getNewMethodTotalPlatformCharge();
        let platformChargeonSchool = totalPlatformCharges;
        if (this.vm.schoolMerchantAccount.platformFeeOnSchoolType === "Flat") {
            platformChargeonSchool = Math.min(totalPlatformCharges, this.vm.schoolMerchantAccount.maxPlatformFeeOnSchool)
        } else {
            platformChargeonSchool = parseFloat((totalPlatformCharges * (this.vm.schoolMerchantAccount.percentageOfPlatformFeeOnSchool / 100)).toFixed(2));
        }
        return parseFloat((totalPlatformCharges - platformChargeonSchool).toFixed(2));
    }
    getNewMethodTotalPayableAmount() {
        return parseFloat((this.vm.getTotalPaymentAmount() + this.getNewMethodPlatformChargeOnParent()).toFixed(2));
    }
}