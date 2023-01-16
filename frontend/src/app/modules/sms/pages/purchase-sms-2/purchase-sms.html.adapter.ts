
import { PurchaseSmsComponent } from "./purchase-sms.component";
import { getDefaultSMSPlans, SMS_CHARGE } from '@modules/sms/class/constants';
import { CommonFunctions } from '@classes/common-functions';

export class PurchaseSmsHtmlAdapter {

    vm: PurchaseSmsComponent;

    smsBalance: number;

    noOfSMS: number = 100;

    smsPlanList = getDefaultSMSPlans();

    isMobile = CommonFunctions.getInstance().isMobileMenu;

    email: string = '';

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

}