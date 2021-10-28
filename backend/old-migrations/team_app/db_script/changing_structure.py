

def changing_structure(apps, schema_editor):

    removing_marksheet(apps)


def removing_marksheet(apps):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    EmployeePermission.objects.filter(parentTask__parentModule__path='marksheet').delete()
    Task.objects.filter(parentModule__path='marksheet').delete()
    Module.objects.filter(path='marksheet').delete()

