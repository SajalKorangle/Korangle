def add_task_update_via_excel(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')


    module_object = Module.objects.get(path='students')
    task_object = Task()
    task_object.parentModule = module_object
    task_object.path = 'update_via_excel'
    task_object.title = 'Update Via Excel'
    task_object.orderNumber = 4
    task_object.parentBoard = None
    task_object.parentFeatureFlag = FeatureFlag.objects.get(name = "Update Via Excel")
    task_object.save()


    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = task_object
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
