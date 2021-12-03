import { PayFeesComponent } from './pay-fees.component';

export class PayFeesHTMLRenderer {
    vm: PayFeesComponent;

    constructor(vm: PayFeesComponent) {
        this.vm = vm;
    }

    isOnlinePaymentEnabled(){
        return this.vm.schoolMerchantAccount && this.vm.schoolMerchantAccount.isEnabled;
    }

}