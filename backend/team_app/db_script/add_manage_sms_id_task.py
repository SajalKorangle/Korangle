
def add_manage_sms_id_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    sms_module = Module.objects.get(path='sms')

    addManageSMSId = Task()
    addManageSMSId.parentModule = sms_module
    addManageSMSId.path = 'manage_sms_id'
    addManageSMSId.title = 'Manage SMS ID'
    addManageSMSId.orderNumber = 4
    addManageSMSId.parentBoard = None
    addManageSMSId.save()

    # Add the employeePermission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = addManageSMSId
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
