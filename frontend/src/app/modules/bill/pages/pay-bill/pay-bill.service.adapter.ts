import { PayBillComponent } from './pay-bill.component';
import { Query } from '@services/generic/query';
import { STATUS_CHOICES } from '@services/modules/payment/models/order';

export class PayBillServiceAdapter {

    vm: PayBillComponent;

    initialiseAdapter(vm: PayBillComponent) {
        this.vm = vm;
    }

    async initialiseData() {

        this.vm.isInitialLoading = true;

        let todaysDate = new Date();
        let halfHourBeforeDate = new Date(((new Date()).getTime()) - 60*30*1000);
        let halfHourBeforeDateStr = halfHourBeforeDate.getFullYear()
            + '-' + ('0' + (halfHourBeforeDate.getMonth()+1)).slice(-2)
            + '-' + ('0' + halfHourBeforeDate.getDate()).slice(-2)
            + 'T' + halfHourBeforeDate.getHours() + ':' + halfHourBeforeDate.getMinutes()
            + ':' + halfHourBeforeDate.getSeconds() + '+05:30';

        // Getting list of unpaid bills and corresponding orders from backend starts
        let unpaidBillListQuery = new Query()
            .filter({
                'parentSchool': this.vm.user.activeSchool.dbId,
                'paidDate': null,
                'billDate__lte': todaysDate.getFullYear() + '-'
                    + ('0' + (halfHourBeforeDate.getMonth()+1)).slice(-2) + '-'
                    + ('0' + halfHourBeforeDate.getDate()).slice(-2),
            })
            .orderBy('-billDate')
            .addChildQuery(
                'billOrderList',
                new Query().filter({
                    'parentOrder__status': STATUS_CHOICES[0],
                    'parentOrder__dateTime__gte': halfHourBeforeDateStr,
                })
                .orderBy('parentOrder__dateTime')
                .paginate(0,1)
                .addParentQuery(
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

}