def add_activity_Module_trackEmployeeActivity_Task(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    module_object = Module(path = 'activity', title = 'Activity', icon = 'assignment', orderNumber = 5, parentBoard = None)
    module_object.save()

    task_object = Task(path = 'track_employee_activity', parentModule = module_object, title = 'Track Employee Activity', orderNumber = 1, parentBoard = None)
    task_object.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path = 'assign_task'):
        employee = EmployeePermission()
        employee.parentTask = task_object
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
