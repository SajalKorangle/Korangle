
def add_manage_sms_id_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    sms_module = Module.objects.get(path='sms')
    fees_module = Module.objects.get(path='fees')

    addManageSMSId = Task()
    addManageSMSId.parentModule = sms_module
    addManageSMSId.path = 'manage_sms_id'
    addManageSMSId.title = 'Manage SMS ID'
    addManageSMSId.orderNumber = 4
    addManageSMSId.parentBoard = None
    addManageSMSId.save()

    addManageTemplates = Task()
    addManageTemplates.parentModule = sms_module
    addManageTemplates.path = 'sms_event_settings'
    addManageTemplates.title = 'SMS Event Settings'
    addManageTemplates.orderNumber = 4
    addManageTemplates.parentBoard = None
    addManageTemplates.save()

    addManageDefaultersTemplates = Task()
    addManageDefaultersTemplates.parentModule = fees_module
    addManageDefaultersTemplates.path = 'manage_defaulters_template'
    addManageDefaultersTemplates.title = 'Manage Defaulters Template'
    addManageDefaultersTemplates.orderNumber = 5
    addManageDefaultersTemplates.parentBoard = None
    addManageDefaultersTemplates.save()

    # Add the employeePermission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = addManageSMSId
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

        employee = EmployeePermission()
        employee.parentTask = addManageTemplates
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

        employee = EmployeePermission()
        employee.parentTask = addManageDefaultersTemplates
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

