def online_class_join_all_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    online_classes_module = Module.objects.get(path='online_classes')
    
    join_all_task=Task.objects.create(
        parentModule=online_classes_module,
        path='join_all',
        title='Join All Classes',
        orderNumber=6,
        parentBoard=None
    )

    # Add the employeePermission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        EmployeePermission.objects.create(
                parentTask=join_all_task,
                parentEmployee=employee_permission.parentEmployee
            )

