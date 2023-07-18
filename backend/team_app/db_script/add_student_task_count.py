def add_student_task_count(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    module_object = Module.objects.get(path='students')
    task_object = Task(path='count_all', title='Count All', orderNumber=3, parentModule=module_object)
    task_object.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = task_object
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
