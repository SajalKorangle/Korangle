
def add_delete_employee_task_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    employee_module = Module.objects.get(path='employees')
    delete_employee = Task(path='delete_employee',title='Delete Employee',orderNumber=7,parentModule=employee_module)
    delete_employee.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=delete_employee, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()