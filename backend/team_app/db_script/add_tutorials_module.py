from team_app.db_script.populate_app import populate_task_in_all_schools

def add_tutorials_module(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    tutorial_module = Module.objects.create(path='tutorials',
                                            title='Tutorials',
                                            icon='video_library',
                                            orderNumber=7,
                                            parentBoard=None)

    task_list = [
        ('add_tutorial', 'Add Tutorial')
    ]

    for module in Module.objects.all():
        order_number = module.orderNumber
        if order_number >= 7:
            module.orderNumber = module.orderNumber + 1
            module.save()


    for index, task in enumerate(task_list):
        task_object = Task.objects.create(
            parentModule=tutorial_module,
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
    
    
    module_object = Module.objects.get(path='tutorials')

    task_object = Task(path='settings', title='Settings', orderNumber=2, parentModule=module_object)
    task_object.save()

    task_list = [] 
    task_list.append(task_object)
    
    populate_task_in_all_schools(apps, task_list)
