def add_track_employee_activity_task_to_employeePermission(apps, schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Employee = apps.get_model('employee_app', 'Employee')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    task = Task.objects.get(path = "track_employee_activity")
    employee = Employee.objects.get(pk = 1025)
    permission_object = EmployeePermission(parentTask = task, parentEmployee = employee)
    permission_object.save()
