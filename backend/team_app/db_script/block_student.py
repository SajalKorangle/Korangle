
def student_add_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    student_module = Module.objects.get(path='students')

    block_student_task = Task.objects.create(
        parentModule=student_module,
        path='block_student',
        title='Block Student',
        orderNumber=13,
        parentBoard=None
    )

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        EmployeePermission.objects.create(
                parentTask=block_student_task,
                parentEmployee=employee_permission.parentEmployee
            )
    