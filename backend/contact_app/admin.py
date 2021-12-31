from django.contrib import admin

# Register your models here.
from contact_app.models import ContactDetail

# Contact Details in Admin panel
@admin.register(ContactDetail)
class ContactDetailsAdmin(admin.ModelAdmin):
    search_fields = ['createdDataTime']
    list_display = ('Name', 'Mobile_Number', 'School_Name', 'Created_Date_Time', 'Remarks')

    def Name(self, obj):
        return str(obj.firstName) + " " + str(obj.lastName)

    def Mobile_Number(self, obj):
        return str(obj.mobileNumber)

    def School_Name(self, obj):
        return str(obj.schoolName)

    def Created_Date_Time(self, obj):
        return str(obj.createdDateTime)

    def Remarks(self, obj):
        return str(obj.remarks)
