
def add_grade_student_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    grade_module = Module.objects.get(path='grade')
    grade_student = Task(path='grade_student',title='Grade Student',orderNumber=2,parentModule=grade_module)
    grade_student.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=grade_student, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()