def add_tc_module_and_tasks(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    
    tc_module = Module.objects.create(path='tc',
                                            title='T.C.',
                                            icon='description',
                                            orderNumber=10,
                                            parentBoard=None)

    task_list = [
        ('design_tc', 'Design T.C.'),
        ('generate_tc', 'Generate T.C.'),
        ('issue_tc', 'Issue T.C.'),
        ('cancel_tc', 'Cancel T.C.'),
        ('tc_logbook', 'View Logbook'),
        ('settings', 'Settings'),
    ]

    for index, task in enumerate(task_list):
        task_object = Task.objects.create(
            parentModule=tc_module,
            path=task[0],
            title=task[1],
            orderNumber=index + 1,
            parentBoard=None
        )

        for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            EmployeePermission.objects.create(
                parentTask=task_object,
                parentEmployee=employee_permission.parentEmployee
            )

