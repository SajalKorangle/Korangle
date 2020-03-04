from team_app.db_script.add_create_grade_permission import add_create_grade_permission

def add_create_grade_task_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    for module in Module.objects.all():
        if module.path == 'grade':
            grade_module = module
    create_grade = Task(path='create_grade',title='Create Grade',orderNumber=1,parentModule=grade_module)
    create_grade.save()
    add_create_grade_permission(apps,schema_editor)