from django_extensions.management.jobs import DailyJob
from payment_app.models import Order
from payment_app.cashfree.cashfree import getOrderStatus

class Job(DailyJob): # Should be run between 3am to 5am
    help = "Cashfree Refund job."


    def execute(self):
        print('Processing pending cashfree jobs...')
        toCheckOrderList = Order.objects.filter(status = 'Pending')
        for orderInstance in toCheckOrderList:
            try:
                cashfreeOrder = getOrderStatus(orderInstance.orderId)
                print(cashfreeOrder)
                if cashfreeOrder['status'] == 'ERROR' and cashfreeOrder['reason'] == 'Order Id does not exist':
                    orderInstance.status = 'Failed'
                    orderInstance.save()
                    continue
                assert cashfreeOrder['orderStatus'] != "ACTIVE"
            except: # continue in case of any bug or order is active or order is nor registered in cashfree
                continue
            if(cashfreeOrder['txStatus']=='SUCCESS'):
                orderInstance.status = 'Completed'
                orderInstance.referenceId = cashfreeOrder['referenceId']
                try:
                    orderInstance.save()
                except:
                    orderInstance.status = 'Refund Pending'
                    orderInstance.save()
            else: 
                orderInstance.status = 'Failed'
                orderInstance.save()
        pass
