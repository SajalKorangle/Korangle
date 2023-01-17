
import { PurchaseSmsComponent } from "./purchase-sms.component";
import { getDefaultSMSPlans, SMS_CHARGE } from '@modules/sms/class/constants';
import { CommonFunctions } from '@classes/common-functions';
import { ModeOfPayment } from "./purchase-sms.models";
import { VALIDATORS_REGX } from "@classes/regx-validators";

export class PurchaseSmsHtmlAdapter {

    vm: PurchaseSmsComponent;

    smsBalance: number;

    noOfSMS: number = 100;

    smsPlanList = getDefaultSMSPlans();

    modeOfPaymentList: ModeOfPayment[];

    selectedModeOfPayment: ModeOfPayment;

    validatorRegex = VALIDATORS_REGX;

    isMobile = CommonFunctions.getInstance().isMobileMenu;

    email: string = '';

    korangle_charge = 5.9;
    gst_charge = 0.18;

    isInitialLoading: boolean;
    isLoading: boolean;

    constructor() { }

    initializeAdapter(vm: PurchaseSmsComponent): void {
        this.vm = vm;
    }

    initializeData(): void {

    }

    getPrice(noOfSMS: number): number {
        return noOfSMS * SMS_CHARGE;
    }

    callSetBubble(value) {
        this.isPlanSelected();
        let range = document.querySelector(".range");
        let bubble = document.querySelector(".bubble");
        this.setBubble(range, bubble, value);
    }

    setBubble(range, bubble, value) {
        if (value >= 100)
            this.noOfSMS = value;
        bubble.innerHTML = this.noOfSMS;

        const min = range.min ? range.min : 0;
        const max = range.max ? range.max : 100;
        const newVal = Number(((this.noOfSMS - min) * 100) / (max - min));

        // Sorta magic numbers based on size of the native UI thumb
        if (!this.isMobile())
            bubble.style.left = `calc(${this.noOfSMS * (30 / 30000) + 1}vw)`;
        else
            bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;

    }

    isPlanSelected() {
        for (let i = 0; i < this.smsPlanList.length; i++) {
            if (this.smsPlanList[i].noOfSms === this.noOfSMS)
                this.smsPlanList[i].selected = true;
            else
                this.smsPlanList[i].selected = false;
        }
    }

    getTotalAmount(modeOfPayment: ModeOfPayment): number {
        let transaction_amount = 0;
        modeOfPayment.modeofpaymentcharges.every(charge => {
            transaction_amount = 0;
            if (charge.chargeType == 'Flat') {
                transaction_amount =
                    parseFloat((
                        this.getPrice(this.noOfSMS) +
                        this.korangle_charge +
                        charge.charge*(1+this.gst_charge)
                    ).toFixed(2));
            } else if (charge.chargeType == 'Percentage') {
                transaction_amount =
                    parseFloat((
                        (this.getPrice(this.noOfSMS) + this.korangle_charge) * 100
                        /
                        (100 - charge.charge * (1 + this.gst_charge))
                    ).toFixed(2));
            }
            if (transaction_amount >= charge.minimumAmount
                && (charge.maximumAmount == -1
                    || transaction_amount <= charge.maximumAmount)) {
                return false;
            }
            return true;
        })
        return transaction_amount;
    }

    getPlatformCharges(modeOfPayment: ModeOfPayment): number {
        return parseFloat((this.getTotalAmount(modeOfPayment) - this.getPrice(this.noOfSMS)).toFixed(2));
    }

}