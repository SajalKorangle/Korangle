
def changeName(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    for task in Task.objects.all():
        if task.title == 'generate_fees_certificate':
            task.title = 'generate_fees_cert'