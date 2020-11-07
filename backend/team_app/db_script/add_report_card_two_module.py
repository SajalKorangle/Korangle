def add_report_card_two_module(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    # To show custom report card along with report card module
    # So the should have same orderNumber
    report_card = Module.objects.filter(title='Report Card')[0]

    report_card_two = Module()
    report_card_two.path = 'report_card'
    report_card_two.title = 'Report Card 2.0'
    report_card_two.icon = report_card.icon
    report_card_two.orderNumber = report_card.orderNumber
    report_card_two.parentBoard = None
    report_card_two.save()

    task_list = [
        ('design_report_card', 'Design Report Card'),
        ('generate_report_card', 'Generate Report Card')
    ]

    for index, task in enumerate(task_list):
        task_object = Task.objects.create(
            parentModule=report_card_two,
            path=task[0],
            title=task[1],
            orderNumber=index + 1,
            parentBoard=None
        )

        for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            EmployeePermission.objects.create(
                parentTask=task_object,
                parentEmployee=employee_permission.parentEmployee
            )