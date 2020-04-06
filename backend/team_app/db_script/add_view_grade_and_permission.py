
def add_view_grade_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    grade_module = Module.objects.get(path='grade')
    view_grade = Task(path='view_grade',title='View Grade',orderNumber=3,parentModule=grade_module)
    view_grade.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=view_grade, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()