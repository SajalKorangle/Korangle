import math
import time

from django_extensions.management.jobs import DailyJob
from push_notifications.models import GCMDevice


class Job(DailyJob):  # Should run at 2.30 am
    help = "Send Notification to Update the App"

    def execute(self):
        gcm_devices = GCMDevice.objects.filter(active=True)
        no_of_iterations = math.ceil(len(gcm_devices) / 50)
        print(no_of_iterations)
        starting_range = 0
        for x in range(0, no_of_iterations):
            sliced_query = gcm_devices[starting_range:starting_range + 50]  # slicing for every 50 numbers
            sliced_devices = gcm_devices.filter(id__in=[s.id for s in sliced_query])
            print(sliced_devices)
            sliced_devices.send_message(None, extra={"data": "UPDATE"})
            starting_range += 50  # increasing the starting range
            time.sleep(120)
