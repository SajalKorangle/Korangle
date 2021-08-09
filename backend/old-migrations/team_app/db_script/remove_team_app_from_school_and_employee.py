

def remove_team_app_access_from_school_and_employee(apps, schema_editor):

    Access = apps.get_model('team_app', 'Access')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app', 'Module')

    Access.objects.filter(parentModule__path='team').delete()
    EmployeePermission.objects.filter(parentTask__parentModule__path='team').delete()
    Task.objects.filter(parentModule__path='team').delete()
    Module.objects.filter(path='team').delete()
