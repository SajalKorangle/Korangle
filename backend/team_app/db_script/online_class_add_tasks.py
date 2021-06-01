
def online_class_add_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    online_classes_module = Module.objects.get(path='online_classes')

    add_account = Task.objects.get(parentModule=online_classes_module, path='add_account')
    add_account.title = 'Add Zoom Account'

    attendance_report_task = Task.objects.create(
        parentModule=online_classes_module,
        path='attendance_report',
        title='Attendance Report',
        orderNumber=5,
        parentBoard=None
    )

    # Add the employeePermission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        EmployeePermission.objects.create(
                parentTask=attendance_report_task,
                parentEmployee=employee_permission.parentEmployee
            )
