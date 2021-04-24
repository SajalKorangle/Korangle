from django.contrib import admin
from .models import Error
from django.contrib.auth.models import User
from school_app.model.models import School
from student_app.models import Student
from employee_app.models import Employee

from django.utils.safestring import mark_safe
from django.core import urlresolvers
from django.db.models import Q
import re

# class ErrorAdmin(admin.ModelAdmin):

#   def get_readonly_fields(self, request, obj=None):
#       return [f.name for f in self.model._meta.fields]+['user_link']

#   def user_link(self, obj):
#       change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
#       return mark_safe('<a href="%s">%s</a>' % (change_url, obj.user.username))

@admin.register(Error)
class ErrorAdmin(admin.ModelAdmin):

    list_display = ('title', 'id', 'Github_Id', 'Page', 'Response', 'Status', 'Name', 'School', 'MobileNumber')

    def title(self, obj):
        return obj.prompt + ' - ' + (obj.dateTime.astimezone().strftime("%d/%m/%Y, %H:%M:%S"))

    def id(self, obj):
        return obj.pk

    def Github_Id(self, obj):
        return obj.githubId

    def Name(self, obj):
        if obj.user:
            return obj.user.first_name + ' ' + obj.user.last_name
        else:
            return '-'

    def MobileNumber(self, obj):
        if obj.user:
            return obj.user.username
        return '-'

    def Page(self, obj):
        if obj.frontendUrl:
            return obj.frontendUrl[24:]
        return '-'

    def Response(self, obj):
        if obj.description:
            string = re.findall('"status":.*?,', obj.description)
            if string:
                return string[0].split(':')[1][:-1]
        return '-'

    def Status(self, obj):
        return obj.issueStatus

    def School(self, obj):
        if obj.frontendUrl:
            string = re.findall('school_id=.*?&', obj.frontendUrl)
            if string:
                schoolId = string[0].split('=')[1][:-1]
                try:
                    int(schoolId)
                    school = School.objects.filter(id=schoolId)
                    if school.count() > 0:
                        return school[0].printName + ' (' + str(school[0].id) + ')'
                except ValueError:
                    return '-'
        if obj.description:
            string = re.findall('activeSchoolID=.*?"', obj.description)
            if string:
                schoolId = string[0].split('=')[1][:-1]
                try:
                    int(schoolId)
                    school = School.objects.filter(id=schoolId)
                    if school.count() > 0:
                        return school[0].printName + ' (' + str(school[0].id) + ')'
                except ValueError:
                    return '-'
        return '-'

    #def get_readonly_fields(self, request, obj=None):
    #    return [f.name for f in self.model._meta.fields]+['user_link']

    #def user_link(self, obj):
    #    change_url = urlresolvers.reverse('admin:auth_user_change', args=(obj.user.id,))
    #    return mark_safe('<a href="%s">%s</a>' % (change_url, obj.user.username))


