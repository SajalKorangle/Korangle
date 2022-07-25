import os
from django_extensions.management.jobs import DailyJob
from authentication_app.models import DeviceList


class Job(DailyJob):
    help = "Delete Device List"

    def execute(self):
        if ("KORANGLE_STAGING" in os.environ) and (
            os.environ["KORANGLE_STAGING"] == "TRUE"
        ):
            print("Deleting Device List...")
            try:
                DeviceList.objects.all().delete()
                print("Deleted Device List")
            except:
                print("Error deleting Device List")
                return
        else:
            print("Please only run this job in the Staging Environment")
