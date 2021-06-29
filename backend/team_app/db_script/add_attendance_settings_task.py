
def add_attendance_settings_task(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    class_module = Module.objects.get(path='attendance')
    settings = Task(path='settings',title='Settings',orderNumber=5,parentModule=class_module)
    settings.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=settings, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()