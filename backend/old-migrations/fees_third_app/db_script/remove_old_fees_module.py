
from team_app.db_script.populate_app import populate_in_all_schools, set_module_order


def remove_old_fees_module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    Access = apps.get_model('team_app', 'Access')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    EmployeePermission.objects.filter(parentTask__parentModule__path='fees-old').delete()
    Task.objects.filter(parentModule__path='fees-old').delete()
    Access.objects.filter(parentModule__path='fees-old').delete()
    Module.objects.get(path='fees-old').delete()
