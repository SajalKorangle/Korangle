def rename_online_class(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    join_class = Task.objects.get(parentModule__path='online_classes', path='join_class')
    join_class.title = 'Teach Class'
    join_class.save()

    attendance_report_task = Task.objects.get(parentModule__path='online_classes', path='attendance_report')
    attendance_report_task.title = 'View Attendance'
    attendance_report_task.save()

    join_all_task = Task.objects.get(parentModule__path='online_classes', path='join_all')
    join_all_task.title = 'Monitor Classes'
    join_all_task.save()

    setting_task = Task.objects.get(parentModule__path='online_classes', path='settings')
    setting_task.title = 'Set Time Table'
    setting_task.save()

    add_account_task = Task.objects.get(parentModule__path='online_classes', path='add_account')
    add_account_task.title = 'Set Meet ID'
    add_account_task.save()