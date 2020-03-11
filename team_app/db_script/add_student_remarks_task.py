
def add_student_remarks_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    custom_reportcard = Module.objects.get(path='custom_reportcard')

    studentRemarksTask = Task()
    studentRemarksTask.parentModule = custom_reportcard
    studentRemarksTask.path = 'student_remarks'
    studentRemarksTask.title = 'Student Remarks'
    studentRemarksTask.orderNumber = 2
    studentRemarksTask.parentBoard = None
    studentRemarksTask.save()

    # Add the employeePermission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = studentRemarksTask
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
