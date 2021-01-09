
import { PurchaseSmsComponent } from "./purchase-sms.component";

export class PurchaseSmsServiceAdapter {

    vm: PurchaseSmsComponent;

    constructor() {}

    initializeAdapter(vm: PurchaseSmsComponent): void {
        this.vm = vm;
    }
    purchasedSMS: number=0;
    initializeData(): void {

        this.vm.isInitialLoading = true;

        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt),
        ]).then(value =>{
            this.vm.smsBalance = value[0].count;
            this.vm.isInitialLoading = false;

        },error =>{
            this.vm.isInitialLoading = false;
        })
    }


}