from django.contrib import admin

# Register your models here.

# from school_app.model.models import Student, Fee, Concession, SubFee, School, Session

from school_app.model.models import School, Session, SchoolSession

from student_app.models import StudentSection

admin.site.register(Session)

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    search_fields = ('printName', 'id')
    list_display = ('Name', 'S_2021_22', 'S_2020_21', 'S_2019_20', 'S_2018_19', 'S_2017_18', 'expired')
    list_filter = ('expired',)

    def Name(self,obj):
        return str(obj.pk) + ' - ' + obj.printName

    def S_2021_22(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2021-22').count())

    def S_2020_21(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2020-21').count())

    def S_2019_20(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2019-20').count())

    def S_2018_19(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2018-19').count())

    def S_2017_18(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2017-18').count())

