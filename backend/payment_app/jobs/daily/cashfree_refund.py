from django_extensions.management.jobs import DailyJob
from django.db import transaction

from payment_app.models import Order
from payment_app.cashfree.cashfree import getOrderStatus, getRefundStatus
from payment_app.models import CashfreeDailyJobsReport
import time
import random


class Job(DailyJob):  # Should be run between 3am to 5am
    help = "Cashfree Orders Updating job."

    def execute(self):
        print('Updating Orders...')

        ## Ensuring that the job is not running more than once start(in case of multiple instances running server)
        waitTime = random.randint(1, 5)
        print('Waiting for {0}s'.format(waitTime))
        time.sleep(waitTime)
        try:
            dailyJobsReport = CashfreeDailyJobsReport.objects.create()
        except:
            print('Executing Failed, Daily Job already executed once')
            return
        ## Ensuring that the job is not running more than once ends

        # Refund Status Check
        refundInitiatedOrderList = Order.objects.filter(status='Refund Initiated')
        for orderInstance in refundInitiatedOrderList:
            try:
                refundStatus = getRefundStatus(orderInstance.refundId)['refund'][0]
                if refundStatus['processed'] == 'YES':
                    orderInstance.status = 'Refunded'
                    orderInstance.save()
            except:
                print('Error processing the refund status')
                continue

        # Order completion check
        pendingOrderList = Order.objects.filter(status='Pending')
        for orderInstance in pendingOrderList:
            try:
                cashfreeOrder = getOrderStatus(orderInstance.orderId, disableAssertion=True)
                if cashfreeOrder['status'] == 'ERROR' and cashfreeOrder['reason'] == 'Order Id does not exist':
                    orderInstance.status = 'Failed'
                    orderInstance.save()
                    continue
                assert cashfreeOrder['orderStatus'] != "ACTIVE"
            except:  # continue in case of order is active or order is nor registered in cashfree or network error on our side or cashfree side
                continue
            if(cashfreeOrder['txStatus'] == 'SUCCESS'):
                orderInstance.status = 'Completed'
                orderInstance.referenceId = cashfreeOrder['referenceId']
                try:
                    with transaction.atomic():
                        orderInstance.save()
                except:
                    orderInstance.status = 'Refund Pending'
                    try:
                        with transaction.atomic():
                            orderInstance.save()
                    except:
                        print('Error processing the order')
            else:
                orderInstance.status = 'Failed'
                with transaction.atomic():
                    orderInstance.save()

        dailyJobsReport.status = 'SUCCESS'
        dailyJobsReport.save()
