def add_update_via_excel_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    employee_module = Module.objects.get(path='fees')
    update_via_excel = Task(path='update_via_excel',title='Update Via Excel',orderNumber=11,parentModule=employee_module)
    update_via_excel.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=update_via_excel, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()