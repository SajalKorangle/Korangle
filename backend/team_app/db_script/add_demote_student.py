def add_demote_student(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    class_module = Module.objects.get(path='class')

    addDemoteStudent = Task()
    addDemoteStudent.parentModule = class_module
    addDemoteStudent.path = 'demote_student'
    addDemoteStudent.title = 'Demote Student'
    addDemoteStudent.orderNumber = 6
    addDemoteStudent.parentBoard = None
    addDemoteStudent.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = addDemoteStudent
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()