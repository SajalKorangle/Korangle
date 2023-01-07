def add_remove_duplicate_marks(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    exam_module = Module.objects.get(path='examinations')

    removeDuplicateMarks = Task()
    removeDuplicateMarks.parentModule = exam_module
    removeDuplicateMarks.path = 'remove_duplicate_marks'
    removeDuplicateMarks.title = 'Remove Duplicate Marks'
    removeDuplicateMarks.orderNumber = 9
    removeDuplicateMarks.parentBoard = None
    removeDuplicateMarks.parentFeatureFlag = None
    removeDuplicateMarks.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = removeDuplicateMarks
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()