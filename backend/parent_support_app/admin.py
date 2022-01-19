from django.contrib import admin

# Register your models here.
from .models import Status, ComplaintType, Complaint, Comment, StatusComplaintType, EmployeeComplaintType, CountAllParentSupport

admin.site.register(Status)
admin.site.register(ComplaintType)
admin.site.register(Complaint)
admin.site.register(Comment)
admin.site.register(StatusComplaintType)
admin.site.register(EmployeeComplaintType)
admin.site.register(CountAllParentSupport)
