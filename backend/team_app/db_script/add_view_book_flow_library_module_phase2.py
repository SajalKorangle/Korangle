def add_view_book_flow_library_module_phase2(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    feature_flag_obj = FeatureFlag.objects.get(
        name="Library Phase 2 (Issue Deposit Book)")

    module_obj = Module.objects.get(path="library")
    
    startIndex = Task.objects.filter(parentModule=module_obj).count()

    task_obj = Task()
    task_obj.parentModule = module_obj
    task_obj.path = 'view_book_flow'
    task_obj.title = 'View Book Flow'
    task_obj.orderNumber = startIndex-1
    task_obj.parentBoard = None
    task_obj.parentFeatureFlag = feature_flag_obj
    task_obj.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = task_obj
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
