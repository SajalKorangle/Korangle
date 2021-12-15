def add_unpromote_student(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    class_module = Module.objects.get(path='class')

    addUnpromoteStudent = Task()
    addUnpromoteStudent.parentModule = class_module
    addUnpromoteStudent.path = 'unpromote_student'
    addUnpromoteStudent.title = 'Unpromote Student'
    addUnpromoteStudent.orderNumber = 6
    addUnpromoteStudent.parentBoard = None
    addUnpromoteStudent.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = addUnpromoteStudent
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()