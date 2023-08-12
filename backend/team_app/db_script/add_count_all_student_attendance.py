def count_all_student_attendance(apps,schema_editor):
    Module = apps.get_model('team_app','Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    attendance_module = Module.objects.get(path="attendance")

    countAllStudentAttendance = Task()
    countAllStudentAttendance.parentModule = attendance_module
    countAllStudentAttendance.path = 'count_student_attendance'
    countAllStudentAttendance.title = 'Count All'
    countAllStudentAttendance.orderNumber = 6
    countAllStudentAttendance.parentBoard = None
    countAllStudentAttendance.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = countAllStudentAttendance
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()