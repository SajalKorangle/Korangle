def add_library_phase_2_pages(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    feature_flag_obj = FeatureFlag.objects.get(
        name="Library Phase 2 (Issue Deposit Book)")

    module_obj = Module.objects.get(path="library")

    new_task_list = [
        {'path': 'issue_deposit_book', 'title': 'Issue/Deposit Book'},
        {'path': 'settings',  'title': 'Settings'}
    ]

    startIndex = Task.objects.filter(parentModule=module_obj).count()

    for index, task in enumerate(new_task_list):
        task_obj = Task()
        task_obj.parentModule = module_obj
        task_obj.path = task['path']
        task_obj.title = task['title']
        task_obj.orderNumber = index+startIndex+1
        task_obj.parentBoard = None
        task_obj.parentFeatureFlag = feature_flag_obj
        task_obj.save()

        for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            employee = EmployeePermission()
            employee.parentTask = task_obj
            employee.parentEmployee = employee_permission.parentEmployee
            employee.save()
