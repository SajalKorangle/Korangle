

def add_view_marks_to_examination(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    module_object = Module.objects.get(path='examinations')

    task_object = Task(path='view_marks', parentModule=module_object, title='View Marks', orderNumber=6, parentBoard=None)
    task_object.save()

    for employee_permission_object in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        new_object = EmployeePermission(parentEmployee=employee_permission_object.parentEmployee,parentTask=task_object)
        new_object.save()

