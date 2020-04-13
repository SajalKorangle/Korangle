def add_update_all_task_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    employee_module = Module.objects.get(path='employees')
    update_all = Task(path='update_all',title='Update All',orderNumber=8,parentModule=employee_module)
    update_all.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=update_all, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()