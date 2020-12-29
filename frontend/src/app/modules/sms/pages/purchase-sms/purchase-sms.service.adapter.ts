
import { PurchaseSmsComponent } from "./purchase-sms.component";

export class PurchaseSmsServiceAdapter {

    vm: PurchaseSmsComponent;

    constructor() {}

    initializeAdapter(vm: PurchaseSmsComponent): void {
        this.vm = vm;
    }

}