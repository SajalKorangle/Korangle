def add_purchase_sms_to_sms(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    module_object = Module.objects.get(path='sms')

    task_object = Task(path='purchase_sms', parentModule=module_object, title='Purchase SMS', orderNumber=4, parentBoard=None)
    task_object.save()

    for employee_permission_object in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        new_object = EmployeePermission(parentEmployee=employee_permission_object.parentEmployee,parentTask=task_object)
        new_object.save()