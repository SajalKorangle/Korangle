
import { Query } from "@services/generic/query";
import { PurchaseSmsComponent } from "./purchase-sms.component";

export class PurchaseSmsServiceAdapter {

    vm: PurchaseSmsComponent;

    purchasedSMS: number = 0;

    constructor() { }

    initializeAdapter(vm: PurchaseSmsComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.htmlAdapter.isInitialLoading = true;

        let purchaseQuery = new Query()
        .filter({id: this.vm.user.activeSchool.dbId})
        .annotate('purchaseCount','smsPurchaseList__numberOfSMS','Sum')
        .setFields('purchaseCount')
        .getObject({school_app: 'School'});

        let spentQuery = new Query()
        .filter({id: this.vm.user.activeSchool.dbId})
        .annotate('spentCount','sms__count','Sum',null,{sms__sentStatus: 'FAILED'})
        .setFields('spentCount')
        .getObject({school_app: 'School'});

        let [
            purchaseValue,
            spentValue,
        ] = await Promise.all([
            purchaseQuery,
            spentQuery
        ]);

        this.vm.htmlAdapter.smsBalance = purchaseValue.purchaseCount - spentValue.spentCount;

        this.vm.htmlAdapter.isInitialLoading = false;

    }

}