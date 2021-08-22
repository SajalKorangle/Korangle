from django_extensions.management.jobs import DailyJob
from django.db import transaction

from payment_app.models import Order
from payment_app.cashfree.cashfree import getOrderStatus, getRefundStatus
from payment_app.models import DailyJobsReport
import time
import random

class Job(DailyJob): # Should be run between 3am to 5am
    help = "Cashfree Orders Updating job."

    def execute(self):
        print('Updating Orders...')
        waitTime = random.randint(1,5)
        print('Waiting for {0}s'.format(waitTime))
        time.sleep(waitTime)
        try:
            dailyJobsReport = DailyJobsReport.objects.create()
        except:
            print('Executing Failed')
            return

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
        
        dailyJobsReport.status = 'SUCCESS'
        dailyJobsReport.save()
