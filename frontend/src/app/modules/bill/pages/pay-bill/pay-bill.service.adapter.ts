import { PayBillComponent } from './pay-bill.component';
import { Query } from '@services/generic/query';

export class PayBillServiceAdapter {

    vm: PayBillComponent;

    initialiseAdapter(vm: PayBillComponent) {
        this.vm = vm;
    }

    async initialiseData() {

        this.vm.isInitialLoading = true;

        // Getting list of unpaid bills from backend starts
        let unpaidBillListQuery = new Query()
            .filter({
                'parentSchool': this.vm.user.activeSchool.dbId,
                'paid': false,
            })
            .getObjectList({bill_app: 'Bill'});

        [this.vm.unpaidBillList] = await Promise.all([unpaidBillListQuery]);
        // Getting list of unpaid bills from backend ends

        this.vm.isInitialLoading = false;

    }

}