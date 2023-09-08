import { ViewHistoryComponent } from './view-history.component';
import { Query } from '@services/generic/query';

export class ViewHistoryServiceAdapter {

    vm: ViewHistoryComponent;

    initialiseAdapter(vm: ViewHistoryComponent) {
        this.vm = vm;
    }

    async initialiseData() {

        this.vm.isInitialLoading = true;

        // Getting list of unpaid bills and corresponding orders from backend starts
        let paidBillListQuery = new Query()
            .filter({
                'parentSchool': this.vm.user.activeSchool.dbId,
                'cancelledDate': null,
            })
            .exclude({
                'paidDate': null,
            })
            .orderBy('-billDate')
            .getObjectList({bill_app: 'Bill'});

        [
            this.vm.paidBillList,
        ] = await Promise.all([
            paidBillListQuery
        ]);
        // Getting list of unpaid bills and corresponding orders from backend ends

        this.vm.isInitialLoading = false;

    }

}