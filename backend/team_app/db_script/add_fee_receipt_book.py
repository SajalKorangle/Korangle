
def add_fee_receipt_book_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    fee_module = Module.objects.get(path='fees')
    receipt_book_task = Task(parentModule=fee_module, path='add_receipt_book', title='Add Receipt Book',
                               parentBoard=None, videoUrl='', orderNumber=15)
    receipt_book_task.save()

    # add entries for employee who has assign task permission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = receipt_book_task
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
