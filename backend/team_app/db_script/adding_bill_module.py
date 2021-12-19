
def adding_bill_module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    # Creating Bill Module Starts

    bill_module = Module(path='bill',title='Bill',icon='paid',orderNumber=15,parentBoard=None)
    bill_module.save()

    # Creating Bill Module Ends

    # Creating Pay Bill Page Starts

    pay_bill_page = Task(parentModule=bill_module,
                         path='pay_bill',title="Pay Bill",orderNumber=1,parentBoard=None,videoUrl=None)
    pay_bill_page.save()

    # Creating Pay Bill Page Ends

    # Creating View History Page Starts

    view_history_page = Task(parentModule=bill_module,
                         path='view_history',title="View History",orderNumber=2,parentBoard=None,videoUrl=None)
    view_history_page.save()

    # Creating View History Page Ends

    # Assigning Employee Permissions Starts

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = pay_bill_page
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

        employee = EmployeePermission()
        employee.parentTask = view_history_page
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

    # Assigning Employee Permissions Ends

