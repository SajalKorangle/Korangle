def add_manage_student_sessions(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    class_module = Module.objects.get(path='class')

    addBacktrackStudent = Task()
    addBacktrackStudent.parentModule = class_module
    addBacktrackStudent.path = 'manage_student_sessions'
    addBacktrackStudent.title = 'Manage Student Sessions'
    addBacktrackStudent.orderNumber = 6
    addBacktrackStudent.parentBoard = None
    addBacktrackStudent.parentFeatureFlag = FeatureFlag.objects.get(name='Backtrack Student')
    addBacktrackStudent.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = addBacktrackStudent
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save() 

def add_backtrack_student(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    class_module = Module.objects.get(path='class')

    addBacktrackStudent = Task()
    addBacktrackStudent.parentModule = class_module
    addBacktrackStudent.path = 'backtrack_student'
    addBacktrackStudent.title = 'Backtrack Student'
    addBacktrackStudent.orderNumber = 5
    addBacktrackStudent.parentBoard = None
    addBacktrackStudent.parentFeatureFlag = FeatureFlag.objects.get(name='Backtrack Student')
    addBacktrackStudent.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = addBacktrackStudent
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()