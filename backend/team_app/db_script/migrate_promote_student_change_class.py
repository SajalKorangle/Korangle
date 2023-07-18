def migrate_promote_student_change_class(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    promote_student_task = Task.objects.get(parentModule__path='students', path='promote_student')
    promote_student_task.parentModule = Module.objects.get(path='class')
    promote_student_task.save()

    change_class_task = Task.objects.get(parentModule__path='students', path='change_class')
    change_class_task.parentModule = Module.objects.get(path='class')
    change_class_task.save()