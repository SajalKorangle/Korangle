def add_my_design_module(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    my_design_module = Module.objects.create(path='my_design',
                           title='My Design',
                           icon='dashboard',
                           orderNumber=5,
                           parentBoard=None)

    task_list = [
        ('design_layout', 'Design Layout'),
        ('generate_certificate', 'Generate Certificate')
    ]

    for index, task in enumerate(task_list):
        task_object = Task.objects.create(
            parentModule=my_design_module,
            path=task[0],
            title=task[1],
            orderNumber=index+1,
            parentBoard=None
        )

        for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            EmployeePermission.objects.create(
                parentTask=task_object,
                parentEmployee=employee_permission.parentEmployee
            )