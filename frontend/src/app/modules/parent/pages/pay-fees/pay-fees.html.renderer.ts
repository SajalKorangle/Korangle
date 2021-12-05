import { PayFeesComponent } from './pay-fees.component';
import { KORANGLE_TRANSACTION_PROCESSING_CHARGE_PERCENTAGE } from '@modules/fees/classes/constants';


export class PayFeesHTMLRenderer {
    vm: PayFeesComponent;

    constructor(vm: PayFeesComponent) {
        this.vm = vm;
    }

    isOnlinePaymentEnabled(){
        return this.vm.schoolMerchantAccount && this.vm.schoolMerchantAccount.isEnabled;
    }

    getUserTransactionProcessingChargePercentage() {
        const processingChargeOnParent = KORANGLE_TRANSACTION_PROCESSING_CHARGE_PERCENTAGE - this.getSchoolTransactionProcessingChargePercentage();
        return (100 * processingChargeOnParent)/(100 - processingChargeOnParent);   // processing charge on parent after including processing charge on added charges
    }

    getSchoolTransactionProcessingChargePercentage() {
        return (this.vm.schoolMerchantAccount.percentageTransactionChargeOnSchool * KORANGLE_TRANSACTION_PROCESSING_CHARGE_PERCENTAGE)/100;
    }

}