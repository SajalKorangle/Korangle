def add_library_module(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    feature_flag_object = FeatureFlag.objects.get(name = "Library")

    module_object = Module(
        path='library',
        title='Library',
        icon='local_library',
        orderNumber=15,
        parentFeatureFlag=feature_flag_object
    )

    module_object.save()

    task_list = [
        { 'path': 'update_book', 'title': 'Update Book' },
        { 'path': 'view_all', 'title': 'View All' },
        { 'path': 'add_via_excel', 'title': 'Add Via Excel' },
        { 'path': 'add_book', 'title': 'Add Book' },
        { 'path': 'delete_book', 'title': 'Delete Book' },
    ]

    for index, task in enumerate(task_list):
        task_object = Task()
        task_object.parentModule = module_object
        task_object.path = task['path']
        task_object.title = task['title']
        task_object.orderNumber = index+1
        task_object.parentBoard = None
        task_object.save()


        for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            employee = EmployeePermission()
            employee.parentTask = task_object
            employee.parentEmployee = employee_permission.parentEmployee
            employee.save()
