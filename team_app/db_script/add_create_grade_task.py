
def add_create_grade_task_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    for module in Module.objects.all():
        if module.path == 'grade':
            grade_module = module
    create_grade = Task(path='create_grade',title='Create Grade',orderNumber=1,parentModule=grade_module)
    create_grade.save()
    
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')
    Task = apps.get_model('team_app','Task')

    parentTask = Task.objects.get(path='create_grade')

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=parentTask, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()