
def add_remarks_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    examination_module = Module.objects.get(path='examinations')

    addRemarksTask = Task()
    addRemarksTask.parentModule = examination_module
    addRemarksTask.path = 'add_student_remarks'
    addRemarksTask.title = 'Add Student Remarks'
    addRemarksTask.orderNumber = 7
    addRemarksTask.parentBoard = None
    addRemarksTask.save()

    # Add the employeePermission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = addRemarksTask
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
