from django.contrib import admin

# Register your models here.

from django.db.models import F
from django.db.models import Q

from datetime import date

from feature_app.models import Feature

from django.contrib.auth import get_user_model
User = get_user_model()
from employee_app.models import Employee
from student_app.models import StudentSection

def getAssociatedSchool(mobileNumber):

    list = ''
    employee_list = ''
    student_list = ''

    for employee_object in Employee.objects.filter(Q(parentSchool__dateOfExpiry=None)
                                                   | Q(parentSchool__dateOfExpiry__gte=date.today()),
                                                   mobileNumber=mobileNumber,
                                                   parentSchool__expired=False,
                                                   dateOfLeaving=None).select_related('parentSchool'):
        employee_list += employee_object.parentSchool.printName + '<br>'

    if employee_list != '' and employee_list != '<br>':
        list += '<br>Employee:- <br>' + employee_list

    for student_section_object in \
            StudentSection.objects.filter(Q(parentStudent__mobileNumber=mobileNumber)
                                          | Q(parentStudent__secondMobileNumber=mobileNumber),
                                          Q(parentStudent__parentSchool__dateOfExpiry=None)
                                          | Q(parentStudent__parentSchool__dateOfExpiry__gte=date.today()),
                                          parentStudent__parentSchool__expired=False,
                                          parentSession=F('parentStudent__parentSchool__currentSession')) \
                    .select_related('parentStudent__parentSchool'):

        student_list += student_section_object.parentStudent.parentSchool.printName + '<br>'

    if student_list != '' and student_list != '<br>':
        list += '<br>Parent:- <br>' + student_list

    return list


from django.utils.html import format_html


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('title', 'generationDateTime', 'user_school', 'status', 'remark')
    list_filter = ('status',)

    '''def title_link(self, obj):
        return str(obj.parentUser.username) + ' - ' + obj.title'''

    def user_school(self, obj):
        return format_html(str(obj.parentUser.first_name) + ' ' + str(obj.parentUser.last_name) + '<br /> ' + getAssociatedSchool(obj.parentUser.username))

    user_school.allow_tags = True

    def remark(self, obj):
        return obj.productManagerRemark

