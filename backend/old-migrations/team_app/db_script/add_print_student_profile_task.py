
def add_print_student_profile_task_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    employee_module = Module.objects.get(path='students')
    print_profile = Task(path='print_profile',title='Print Profile',orderNumber=1,parentModule=employee_module)
    print_profile.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=print_profile, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()