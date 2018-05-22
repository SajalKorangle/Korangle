
from team_app.models import Access, Task


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
