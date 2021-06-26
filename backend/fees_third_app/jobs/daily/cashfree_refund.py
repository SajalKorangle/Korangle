from django_extensions.management.jobs import DailyJob
from datetime import datetime, timedelta
import pytz
from fees_third_app.models import Order
from fees_third_app.cashfree.cashfree import isOrderCompleted

class Job(DailyJob):
    help = "My sample job."

    def execute(self):
        print('Processing pending cashfree jobs...')
        now =datetime.now()
        timezone = pytz.timezone("Asia/Kolkata")
        fromDateTime = timezone.localize( datetime(now.year, now.month, now.day) - timedelta(days=1))
        toCheckOrderList = Order.objects.filter(dateTime__gte=fromDateTime, status = 'Pending')
        for orderInstance in toCheckOrderList:
            if(isOrderCompleted(orderInstance.orderId)):
                try:
                    orderInstance.status = 'Completed'
                    orderInstance.save()
                except:
                    orderInstance.status = 'Refund Pending'
                    orderInstance.save()
            else: 
                orderInstance.status = 'Failed'
                orderInstance.save()
        pass
