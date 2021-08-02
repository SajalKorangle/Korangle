from django.contrib import admin

# Register your models here.

# from school_app.model.models import Student, Fee, Concession, SubFee, School, Session

from school_app.model.models import School, Session, SchoolSession


from student_app.models import StudentSection
from fees_third_app.models import FeeReceipt
from subject_app.models import ClassSubject
from examination_app.models import StudentTest
from employee_app.models import Employee
from homework_app.models import HomeworkQuestion
from tutorial_app.models import Tutorial
from datetime import date
from django.db.models import Q

admin.site.register(Session)


from django.utils.translation import gettext_lazy as _


class ActiveListFilter(admin.SimpleListFilter):
    title = _('Active')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'active'

    def lookups(self, request, model_admin):
        return (
            ('Yes', _('Yes')),
            ('No', _('No')),
        )

    def queryset(self, request, queryset):

        if self.value() == 'No':
            return queryset.filter(Q(expired=True) | Q(dateOfExpiry__lt=date.today()))
        if self.value() == 'Yes':
            return queryset.filter(Q(dateOfExpiry=None) | Q(dateOfExpiry__gte=date.today()), expired=False)


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    search_fields = ('printName', 'id')
    list_display = ('Name', 'Stud','Empl', 'Fee_Receipts', 'Subj', 'Stud_Marks', 'Hwk_Ques', 'Tuts', 'Active', 'S_2020_21', 'S_2019_20', 'S_2018_19', 'S_2017_18')
    list_filter = (ActiveListFilter,)

    def Name(self,obj):
        return str(obj.pk) + ' - ' + obj.printName

    def Stud(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2021-22').count())

    def Empl(self, obj):
        return str(Employee.objects.filter(parentSchool_id=obj.pk).count())

    def Fee_Receipts(self, obj):
        return str(FeeReceipt.objects.filter(parentSchool_id=obj.pk, parentSession__name='Session 2021-22').count())

    def Subj(self, obj):
        return str(ClassSubject.objects.filter(parentSchool_id=obj.pk, parentSession__name='2021-04-01').count())

    def Stud_Marks(self, obj):
        return str(StudentTest.objects.filter(parentStudent__parentSchool_id=obj.pk, parentExamination__parentSession__name='2021-04-01').count())

    def Hwk_Ques(self, obj):
        return str(HomeworkQuestion.objects.filter(parentClassSubject__parentSchool_id=obj.pk, parentClassSubject__parentSession__name='2021-04-01').count())

    def Tuts(self, obj):
        return str(Tutorial.objects.filter(parentClassSubject__parentSchool_id=obj.pk, parentClassSubject__parentSession__name='2021-04-01').count())

    def Active(self, obj):
        if obj.expired:
            return 'No'
        if obj.dateOfExpiry is None:
            return 'Yes'
        if obj.dateOfExpiry < date.today():
            return 'No'
        else:
            return 'Yes'

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

