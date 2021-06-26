
def add_manage_parameter_page_to_employee_module(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    employee_module = Module.objects.get(path='employees')
    manage_parameter = Task(path='manage_parameter',title='Manage Parameter',orderNumber=9,parentModule=employee_module)
    manage_parameter.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=manage_parameter, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()