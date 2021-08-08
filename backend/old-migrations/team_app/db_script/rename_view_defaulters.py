def rename_view_defaulters(apps, schema_editor):
    Task = apps.get_model('team_app', 'Task')
    task_object = Task.objects.get(title="View Defaulters")
    task_object.title = "Notify Defaulters"
    task_object.save()