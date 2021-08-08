

def add_class_module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='class',title='Class',icon='people',orderNumber=13,parentBoard=None)
    module_object.save()

    add_update_class_task(apps, module_object)

    change_task_row(apps, module_object)


def add_update_class_task(apps, module_object):

    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    task_object = Task(path='update_class', parentModule=module_object, title='Update Class', orderNumber=1, parentBoard=None)
    task_object.save()

    for employee_permission_object in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        new_object = EmployeePermission(parentEmployee=employee_permission_object.parentEmployee,parentTask=task_object)
        new_object.save()


def change_task_row(apps, module_object):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    task_object = Task.objects.get(path='give_permissions')
    task_object.path='assign_class'
    task_object.title='Assign Class'
    task_object.parentModule = module_object
    task_object.orderNumber=2
    task_object.save()
