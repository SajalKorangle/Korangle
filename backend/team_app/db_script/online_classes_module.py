def add_online_classes_module_and_tasks(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    
    online_classes_module = Module.objects.create(path='online_classes',
                                            title='Online Classes',
                                            icon='video_camera_front',
                                            orderNumber=10,
                                            parentBoard=None)

    task_list = [
        ('join_class', 'Join Class'),
        ('settings', 'Schedule Class'),
        ('add_account', 'Add Account'),
        ('student_permission', 'Student Permission'),
    ]

    for index, task in enumerate(task_list):
        task_object = Task.objects.create(
            parentModule=online_classes_module,
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

