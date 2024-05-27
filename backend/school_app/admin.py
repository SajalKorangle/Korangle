from django.utils.translation import gettext_lazy as _
from django.contrib import admin

# Register your models here.

# from school_app.model.models import Student, Fee, Concession, SubFee, School, Session

from school_app.model.models import School, Session, SchoolSession


from student_app.models import StudentSection
from fees_third_app.models import FeeReceipt
from examination_app.models import StudentTest
from employee_app.models import Employee
from datetime import date
from django.db.models import Q

admin.site.register(Session)


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
    list_display = ('Name', 'Stud', 'Empl', 'Fee_Receipts', 'Stud_Marks',
                    'Active', 'S_2023_24', 'S_2022_23')
    list_filter = (ActiveListFilter,)

    def Name(self, obj):
        return str(obj.pk) + ' - ' + obj.printName

    def Stud(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2024-25').count())

    def Empl(self, obj):
        return str(Employee.objects.filter(parentSchool_id=obj.pk).count())

    def Fee_Receipts(self, obj):
        return str(FeeReceipt.objects.filter(parentSchool_id=obj.pk).count())

    def Stud_Marks(self, obj):
        return str(StudentTest.objects.filter(parentStudent__parentSchool_id=obj.pk).count())

    def Active(self, obj):
        if obj.expired:
            return 'No'
        if obj.dateOfExpiry is None:
            return 'Yes'
        if obj.dateOfExpiry < date.today():
            return 'No'
        else:
            return 'Yes'

    def S_2023_24(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2023-24').count())

    def S_2022_23(self, obj):
        return str(StudentSection.objects.filter(parentStudent__parentSchool_id=obj.pk, parentSession__name='Session 2022-23').count())
