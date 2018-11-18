
from team_app.models import Access, Task, Module

from rest_framework import serializers


class ModuleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'


def get_module_by_object(module_object):

    module = {}
    module['dbId'] = module_object.id
    module['path'] = module_object.path
    module['title'] = module_object.title
    module['icon'] = module_object.icon
    module['taskList'] = []

    for task_object in Task.objects.filter(parentModule=module_object).order_by('orderNumber'):

        task = {}
        task['dbId'] = task_object.id
        task['path'] = task_object.path
        task['title'] = task_object.title

        module['taskList'].append(task)

    return module


def get_school_module_list(data):

    module_list = []

    for access_object in Access.objects.filter(parentSchool_id=data['schoolDbId'])\
            .order_by('parentModule__orderNumber').select_related('parentModule'):

        module_list.append(get_module_by_object(access_object.parentModule))

    return module_list


def get_latest_module_list():

    module_list = []

    for module_object in Module.objects.all().exclude(path='marksheet'):
        module_list.append(ModuleModelSerializer(module_object).data)

    return module_list


def get_module_list():

    module_list = []

    for module_object in Module.objects.all():
        module_list.append(ModuleModelSerializer(module_object).data)

    return module_list
