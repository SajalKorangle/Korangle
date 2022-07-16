from django_extensions.management.jobs import DailyJob
from authentication_app.models import DeviceList


class Job(DailyJob):
    help = "Delete Device List"

    def execute(self):
        print("Deleting Device List...")
        try:
            DeviceList.objects.all().delete()
            print("Deleted Device List")
        except:
            print("Error deleting Device List")
            return
