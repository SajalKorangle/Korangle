import math

from celery.schedules import crontab
from celery.task import periodic_task
from push_notifications.models import GCMDevice


@periodic_task(run_every=crontab(hour=2, minute=30))
def UpdateApp():
    fcm_devices = GCMDevice.objects.filter(active=True)
    count = math.ceil(len(fcm_devices)/50)
    iterator = 0
    for x in range(0, count):
        devices = fcm_devices[iterator:iterator + 50]
        devices.send_message(None, extra={"data": "UPDATE"})
        iterator += 50
