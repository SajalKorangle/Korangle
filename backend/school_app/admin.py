from django.contrib import admin

# Register your models here.

# from school_app.model.models import Student, Fee, Concession, SubFee, School, Session

from school_app.model.models import School, Session, SchoolSession


from student_app.models import StudentSection
from fees_third_app.models import SubFeeReceipt
from subject_app.models import ClassSubject
from examination_app.models import StudentTest

admin.site.register(Session)

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    search_fields = ('printName', 'id')
    list_display = ('Name', 'Students', 'Fees', 'Subjects', 'Exam', 'expired', 'S_2020_21', 'S_2019_20', 'S_2018_19', 'S_2017_18')
    list_filter = ('expired',)

    def Name(self,obj):
        return str(obj.pk) + ' - ' + obj.printName

    def Students(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2021-22').count())

    def Fees(self, obj):
        return str(SubFeeReceipt.objects.filter(parentStudentFee__parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2021-22').count())

    def Subjects(self, obj):
        return str(ClassSubject.objects.filter(parentSchool_id=obj.pk, parentSession__name='2021-04-01').count())

    def Exam(self, obj):
        return str(StudentTest.objects.filter(parentStudent__parentSchool_id=obj.pk, parentExamination__parentSession__name='2021-04-01').count())

    def S_2020_21(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2020-21').count())

    def S_2019_20(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2019-20').count())

    def S_2018_19(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2018-19').count())

    def S_2017_18(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2017-18').count())

'''@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    search_fields = ('printName', 'id')
    list_display = ('Name', 'Students', 'Fees', 'Attendance', 'expired')
    list_filter = ('expired',)

    def Name(self,obj):
        return str(obj.pk) + ' - ' + obj.printName

    def Students(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2021-22').count())

    def Fees(self, obj):
        return str(SubFeeReceipt.objects.filter(parentStudentFee__parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2021-22').count())

    def Attendance(self, obj):
        return str(StudentAttendance.objects.filter(parentStudent__parentSchool_id=obj.pk, dateOfAttendance__gte='2021-04-01').count())'''

