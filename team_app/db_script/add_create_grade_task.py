
def add_create_grade_task_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    grade_module = Module.objects.get(path='grade')
    create_grade = Task(path='create_grade',title='Create Grade',orderNumber=1,parentModule=grade_module)
    create_grade.save()
<<<<<<< HEAD

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=create_grade, parentEmployee=employee_permission.parentEmployee)
=======
    
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')
    Task = apps.get_model('team_app','Task')

    parentTask = Task.objects.get(path='create_grade')

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=parentTask, parentEmployee=employee_permission.parentEmployee)
>>>>>>> 2bb0c8a46f956607e15e97d01c07444c2659a78c
            permissionObject.save()