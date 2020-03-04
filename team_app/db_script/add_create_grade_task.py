
def add_create_grade_task_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    grade_module = Module.objects.get(path='grade')
    create_grade = Task(path='create_grade',title='Create Grade',orderNumber=1,parentModule=grade_module)
    create_grade.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=create_grade, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()