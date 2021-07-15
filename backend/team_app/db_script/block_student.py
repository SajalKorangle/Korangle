
def student_add_task(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    block_student_task = Task.objects.get(parentModule__path='online_classes', path='student_permission')
    block_student_task.parentModule = Module.objects.get(path='students')
    block_student_task.save()
    