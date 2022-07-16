import os
from django_extensions.management.jobs import DailyJob
from django.contrib.auth import get_user_model

User = get_user_model()


class Job(DailyJob):
    help = "Reset Passwords"

    def execute(self):
        if ("KORANGLE_STAGING" in os.environ) and (
            os.environ["KORANGLE_STAGING"] == "TRUE"
        ):
            print("Resetting All Passwords...")
            try:
                all_users_qs = User.objects.all()
                all_users_qs[0].set_password("12345678")
                all_users_qs[0].save()
                hashed_password = all_users_qs[0].password
                all_users_qs.update(password=hashed_password)
                print("All Passwords Reset")
            except:
                print("Error Resetting Passwords")
                return
        else:
            print("Please only run this job in the Staging Environment")
