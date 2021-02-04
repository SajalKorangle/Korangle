

def add_online_payment_account_page(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    module_object = Module.objects.get(path='fees')

    task_object = Task(path='online_payment_account', parentModule=module_object, title='Online Payment Account', orderNumber=16, parentBoard=None)
    task_object.save()

    for employee_permission_object in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        new_object = EmployeePermission(parentEmployee=employee_permission_object.parentEmployee,parentTask=task_object)
        new_object.save()

