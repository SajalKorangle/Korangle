def add_purchase_sms_2(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    sms_module = Module.objects.get(path='sms')

    purchaseSms2Page = Task()
    purchaseSms2Page.parentModule = sms_module
    purchaseSms2Page.path = 'purchase_sms_2'
    purchaseSms2Page.title = 'Purchase SMS 2.0'
    purchaseSms2Page.orderNumber = 5
    purchaseSms2Page.parentBoard = None
    purchaseSms2Page.parentFeatureFlag = FeatureFlag.objects.get(name='Easebuzz Online Payment Gateway Feature Flag')
    purchaseSms2Page.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='purchase_sms'):
        employee = EmployeePermission()
        employee.parentTask = purchaseSms2Page
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()