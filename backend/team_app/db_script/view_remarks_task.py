
def view_remarks_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    examination_module = Module.objects.get(path='examinations')

    viewRemarksTask = Task()
    viewRemarksTask.parentModule = examination_module
    viewRemarksTask.path = 'view_student_remarks'
    viewRemarksTask.title = 'View Student Remarks'
    viewRemarksTask.orderNumber = 8
    viewRemarksTask.parentBoard = None
    viewRemarksTask.save()

    # Add the employeePermission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = viewRemarksTask
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
