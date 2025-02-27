def add_report_card_3_module(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    report_card_module = Module(path='report_card_3.0', title='R.C. 3.0', icon='book', orderNumber=9, parentBoard=None)
    report_card_module.save()

def add_design_report_card_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    
    report_card_3_module = Module.objects.get(path='report_card_3.0')
    design_report_card = Task(path='design_report_card', title='Design Report Card', orderNumber=1, parentModule=report_card_3_module)
    design_report_card.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=design_report_card, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()

def add_generate_report_card_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    
    report_card_3_module = Module.objects.get(path='report_card_3.0')
    generate_report_card = Task(path='generate_report_card', title='Generate Report Card', orderNumber=2, parentModule=report_card_3_module)
    generate_report_card.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=generate_report_card, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()