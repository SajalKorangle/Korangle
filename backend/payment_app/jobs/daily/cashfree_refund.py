from django_extensions.management.jobs import DailyJob
from django.db import transaction

from payment_app.models import Order
from payment_app.cashfree.cashfree import getOrderStatus, getRefundStatus



class Job(DailyJob): # Should be run between 3am to 5am
    help = "Cashfree Orders Updating job."


    def execute(self):
        print('Updating Orders...')

        # Refund Status Check
        toCheckOrderList = Order.objects.filter(status = 'Refund Initiated')
        for orderInstance in toCheckOrderList:
            try:
                refundStatus = getRefundStatus(orderInstance.refundId)['refund'][0]
                if refundStatus['processed'] == 'YES':
                    orderInstance.status = 'Refunded'
                    orderInstance.save()
            except:
                continue

        # Order completion check
        toCheckOrderList = Order.objects.filter(status = 'Pending')
        for orderInstance in toCheckOrderList:
            try:
                cashfreeOrder = getOrderStatus(orderInstance.orderId, disableAssertion=True)
                print(cashfreeOrder)
                if cashfreeOrder['status'] == 'ERROR' and cashfreeOrder['reason'] == 'Order Id does not exist':
                    orderInstance.status = 'Failed'
                    orderInstance.save()   
                    continue
                assert cashfreeOrder['orderStatus'] != "ACTIVE"
            except: # continue in case of order is active or order is nor registered in cashfree or network error on our side or cashfree side
                continue
            if(cashfreeOrder['txStatus']=='SUCCESS'):
                orderInstance.status = 'Completed'
                orderInstance.referenceId = cashfreeOrder['referenceId']
                try:
                    with transaction.atomic():
                        orderInstance.save()
                except:
                    orderInstance.status = 'Refund Pending'
                    orderInstance.save()
            else: 
                orderInstance.status = 'Failed'
                orderInstance.save()
        pass
