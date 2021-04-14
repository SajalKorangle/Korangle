from django.contrib import admin

# Register your models here.

# from school_app.model.models import Student, Fee, Concession, SubFee, School, Session

from school_app.model.models import School, Session, SchoolSession

from student_app.models import StudentSection

admin.site.register(Session)

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('Name', 'Session_2020_21', 'Session_2021_22', 'expired')
    list_filter = ('expired',)

    def Name(self,obj):
        return str(obj.pk) + ' - ' + obj.printName

    def Session_2020_21(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2020-21').count())

    def Session_2021_22(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2021-22').count())