import { PayBillComponent } from './pay-bill.component';
import { Query } from '@services/generic/query';

export class PayBillServiceAdapter {

    vm: PayBillComponent;

    initialiseAdapter(vm: PayBillComponent) {
        this.vm = vm;
    }

    async initialiseData() {

        this.vm.isInitialLoading = true;

        // Getting list of unpaid bills and corresponding orders from backend starts
        let unpaidBillListQuery = new Query()
            .filter({
                'parentSchool': this.vm.user.activeSchool.dbId,
                'paidDate': null,
            })
            .addChildQuery(
                'billOrderList',
                new Query().addParentQuery(
                    'parentOrder',
                    new Query()
                )
            )
            .getObjectList({bill_app: 'Bill'});

        [
            this.vm.unpaidBillList,
            this.vm.modeOfPaymentList
        ] = await Promise.all([
            unpaidBillListQuery,
            new Query().addChildQuery(
                'modeofpaymentcharges',
                new Query()
            ).addParentQuery(
                'parentPaymentGateway',
                new Query()
            ).getObjectList({payment_app: 'ModeOfPayment'})
        ]);
        // Getting list of unpaid bills and corresponding orders from backend ends

        this.vm.isInitialLoading = false;

    }

    // paying the bill
    async payBill(bill: any) {
        
        // Generating Order

        // Calling Easebuzz

    }

    // refresh the status of order.
    async refreshBillStatus(bill: any) {

    }

}