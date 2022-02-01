from django.contrib import admin

# Register your models here.
from .models import SchoolComplaintStatus, SchoolComplaintType, Complaint, Comment, StatusComplaintType, EmployeeComplaintType, CountAllParentSupport

admin.site.register(SchoolComplaintStatus)
admin.site.register(SchoolComplaintType)
admin.site.register(Complaint)
admin.site.register(Comment)
admin.site.register(StatusComplaintType)
admin.site.register(EmployeeComplaintType)
admin.site.register(CountAllParentSupport)
