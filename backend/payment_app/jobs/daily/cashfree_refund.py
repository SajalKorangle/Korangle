from django_extensions.management.jobs import DailyJob
from datetime import datetime, timedelta
import pytz
from payment_app.models import Order
from payment_app.cashfree.cashfree import isOrderCompleted

class Job(DailyJob): # Should be run between 3am to 5am
    help = "Cashfree Refund job."

    def execute(self):
        print('Processing pending cashfree jobs...')
        now =datetime.now()
        timezone = pytz.timezone("Asia/Kolkata")
        fromDateTime = timezone.localize( datetime(now.year, now.month, now.day) - timedelta(days=1))
        toDateTime = timezone.localize(now - timedelta(hours=1))
        toCheckOrderList = Order.objects.filter(dateTime__gte=fromDateTime, datetime__lte=toDateTime, status = 'Pending')
        for orderInstance in toCheckOrderList:
            orderComplete = isOrderCompleted(orderInstance.orderId)
            if(orderComplete):
                try:
                    orderInstance.status = 'Completed'
                    orderInstance.referenceId = orderComplete['referenceId']
                    orderInstance.save()
                except:
                    orderInstance.status = 'Refund Pending'
                    orderInstance.save()
            else: 
                orderInstance.status = 'Failed'
                orderInstance.save()
        pass
