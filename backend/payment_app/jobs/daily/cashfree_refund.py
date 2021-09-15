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
        waitTime = random.randint(1, 5)
        print('Waiting for {0}s'.format(waitTime))
        time.sleep(waitTime)
        try:
            dailyJobsReport = CashfreeDailyJobsReport.objects.create()
        except:
            print('Executing Failed')
            return

        # Refund Status Check
        # Code Review
        # Change the name from 'toCheckOrderList' to 'refundInitiatedOrderList'
        # @answer : Done
        refundInitiatedOrderList = Order.objects.filter(status='Refund Initiated')
        for orderInstance in refundInitiatedOrderList:
            try:
                refundStatus = getRefundStatus(orderInstance.refundId)['refund'][0]
                if refundStatus['processed'] == 'YES':
                    orderInstance.status = 'Refunded'
                    orderInstance.save()
            except:
                continue

        # Order completion check
        # Code Review
        # Change the name from 'toCheckOrderList' to 'pendingOrderList'
        # @answer : done
        pendingOrderList = Order.objects.filter(status='Pending')
        for orderInstance in pendingOrderList:
            try:
                cashfreeOrder = getOrderStatus(orderInstance.orderId, disableAssertion=True)
                # Code Review
                # Is this printing statement required?
                # @answer : No, it is there for debugging only
                print(cashfreeOrder)
                if cashfreeOrder['status'] == 'ERROR' and cashfreeOrder['reason'] == 'Order Id does not exist':
                    orderInstance.status = 'Failed'
                    orderInstance.save()
                    continue
                assert cashfreeOrder['orderStatus'] != "ACTIVE"
            # Code Review
            # If there is a network error on our side or cashfree side,
            # we are changing the status of order to 'Failed'. Please confirm.
            # @answer : No, in case of any unknown error we are skipping that order row. We are changing the status to failed only after checking the response from cashfree
            except:  # continue in case of order is active or order is nor registered in cashfree or network error on our side or cashfree side
                continue
            if(cashfreeOrder['txStatus'] == 'SUCCESS'):
                orderInstance.status = 'Completed'
                orderInstance.referenceId = cashfreeOrder['referenceId']
                try:
                    # Code Review
                    # Why transaction atomic here but not at other places?
                    # @answer : it is to avoid any partial save of models(sub fee receipts and all). I am adding at other places to make the code consistent
                    with transaction.atomic():
                        orderInstance.save()
                except:
                    orderInstance.status = 'Refund Pending'
                    with transaction.atomic():
                        orderInstance.save()
            else:
                orderInstance.status = 'Failed'
                with transaction.atomic():
                    orderInstance.save()

        dailyJobsReport.status = 'SUCCESS'
        dailyJobsReport.save()
