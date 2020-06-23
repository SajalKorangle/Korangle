def add_id_card_module(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    id_card_module = Module.objects.create(path='id_card',
                           title='ID Card',
                           icon='portrait',
                           orderNumber=9,
                           parentBoard=None)

    task_list = [
        ('manage_layouts', 'Manage Layouts'),
        ('generate_id_card', 'Generate ID Card')
    ]

    for index, task in enumerate(task_list):
        task_object = Task.objects.create(
            parentModule=id_card_module,
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