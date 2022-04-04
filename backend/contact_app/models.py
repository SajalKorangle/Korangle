from django.db import models


class ContactDetail(models.Model):
    mobileNumber = models.CharField(max_length=12, null=False)
    firstName = models.CharField(max_length=100, null=False)
    lastName = models.CharField(max_length=100, null=False)
    emailId = models.EmailField(null=True, blank=True)
    schoolName = models.TextField(null=True)
    remarks = models.TextField(null=True)  # For Technical Support if he needs to enter any remarks
    createdDateTime = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact_detail'
