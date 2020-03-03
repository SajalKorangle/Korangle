
def add_create_grade_task(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    for module in Module.objects.all():
        if module.path == 'grade':
            grade_module = module
    create_grade = Task(path='create-grade',title='Create Grade',orderNumber=1,parentModule=grade_module)
    create_grade.save()