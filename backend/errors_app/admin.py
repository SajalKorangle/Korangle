from django.contrib import admin, messages
from django.contrib.admin.helpers import ActionForm
from django import forms
from django.utils.safestring import mark_safe
from django.urls import reverse
import re
from django.utils.translation import gettext_lazy as _

from .models import Error
from school_app.model.models import School

from rangefilter.filters import DateTimeRangeFilter


class UpdateStatusActionForm(ActionForm):
    githubId = forms.CharField(max_length=10, required=False)
    issueStatus = forms.CharField(max_length=50, required=True)


class PromptListFilter(admin.SimpleListFilter):
    title = _('Response')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'prompt'

    def lookups(self, request, model_admin):
        return (
            ('get', _('get')),
            ('post', _('post')),
            ('put', _('put')),
            ('patch', _('patch')),
            ('delete', _('delete')),
            ('window', _('window')),
            ('layout', _('layout')),
            ('other', _('other')),
        )

    def queryset(self, request, queryset):

        if self.value() == 'other':
            return queryset.exclude(prompt__contains='post').exclude(prompt__contains='get')\
                .exclude(prompt__contains='put').exclude(prompt__contains='patch').exclude(prompt__contains='delete')\
                .exclude(prompt__contains='window').exclude(prompt__contains='layout')
        if self.value() == 'get' or self.value() == 'post' or self.value() == 'put' or self.value() == 'patch'\
                or self.value() == 'delete' or self.value() == 'window' or self.value() == 'layout':
            return queryset.filter(prompt__contains=self.value())


class ResponseListFilter(admin.SimpleListFilter):

    title = _('Response')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'description'

    def lookups(self, request, model_admin):
        return (
            ('500', _('500')),
            ('0', _('0')),
            ('Other', _('Other')),
        )

    def queryset(self, request, queryset):

        if self.value() == '500':
            return queryset.filter(description__contains='"status":500,')
        if self.value() == '0':
            return queryset.filter(description__contains='"status":0,')
        if self.value() == 'Other':
            return queryset.exclude(description__contains='"status":500,').exclude(description__contains='"status":0,')


@admin.register(Error)
class ErrorAdmin(admin.ModelAdmin):

    list_display = ('title', 'Page', 'Response', 'Name', 'School', 'MobileNumber', 'id', 'Status', 'Github_Id')
    list_filter = ('dateTime', ('dateTime', DateTimeRangeFilter), 'issueStatus', ResponseListFilter, PromptListFilter,)
    search_fields = ("githubId",)

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

    action_form = UpdateStatusActionForm

    def update_status(modeladmin, request, queryset):
        githubId = request.POST['githubId']
        issueStatus = request.POST['issueStatus']
        queryset.update(githubId=githubId, issueStatus=issueStatus)
        modeladmin.message_user(request, ("Successfully updated status for %d rows") % (queryset.count(),),
                                messages.SUCCESS)

    admin.site.add_action(update_status, 'Update Error Status')

    def get_readonly_fields(self, request, obj=None):
        return [f.name for f in self.model._meta.fields]+['user_link']

    def user_link(self, obj):
        change_url = reverse('admin:user_app_user_change', args=(obj.user.id,))
        return mark_safe('<a href="%s">%s</a>' % (change_url, obj.user.username))


