import { SettingsComponent } from './settings.component';
import { KORANGLE_TRANSACTION_PROCESSING_CHARGE_PERCENTAGE } from '@modules/fees/classes/constants';

export class SettingsHtmlRenderer {

    constructor(public vm: SettingsComponent) { }

    getUserTransactionProcessingChargePercentage() {
        const processingChargeOnParent = KORANGLE_TRANSACTION_PROCESSING_CHARGE_PERCENTAGE - this.getSchoolTransactionProcessingChargePercentage();
        return (100 * processingChargeOnParent)/(100 - processingChargeOnParent);   // processing charge on parent after including processing charge on added charges
    }

    getSchoolTransactionProcessingChargePercentage() {
        return (this.vm.backendData.feeSettings.percentageTransactionChargeOnSchool * KORANGLE_TRANSACTION_PROCESSING_CHARGE_PERCENTAGE)/100;
    }

}