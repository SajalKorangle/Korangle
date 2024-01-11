def add_fees_view_list_page(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')


    module_object = Module.objects.get(path='fees')
    task_object = Task()
    task_object.parentModule = module_object
    task_object.path = 'view_list'
    task_object.title = 'View List'
    task_object.orderNumber = 4
    task_object.parentBoard = None
    task_object.save()


    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = task_object
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
