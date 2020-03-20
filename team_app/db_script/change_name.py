
def changeName(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    for task in Task.objects.filter(title = 'Generate Fees Certificate'):
        task.title = 'Generate Fees Cert.'
        task.save()