
import { OnlinePaymentAccountComponent } from './online-payment-account.component';

export class OnlinePaymentAccountServiceAdapter {

    vm: OnlinePaymentAccountComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: OnlinePaymentAccountComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        
    }



}