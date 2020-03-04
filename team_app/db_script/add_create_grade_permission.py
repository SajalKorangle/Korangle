
def add_create_grade_permission(apps,schema_editor):
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')
    Task = apps.get_model('team_app','Task')

    parentTask = Task.objects.get(path='create_grade')

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=parentTask, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()