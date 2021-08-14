def update_add_account_name(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    add_account_task = Task.objects.get(parentModule__path='online_classes', path='add_account')
    add_account_task.title = 'Set Zoom Account'
    add_account_task.save()
