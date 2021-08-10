from team_app.db_script.populate_app import populate_task_in_all_schools


def add_event_gallery_module(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    event_gallery_module = Module.objects.create(path='event_gallery',
                                                 title='Event Gallery',
                                                 icon='event',
                                                 orderNumber=15,
                                                 parentBoard=None)

    task_list = [
        ('add_event', 'Add Event'),
        ('manage_event', 'Manage Event'),
        ('view_event', 'View Event')
    ]

    for index, task in enumerate(task_list):
        task_object = Task.objects.create(
            parentModule=event_gallery_module,
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