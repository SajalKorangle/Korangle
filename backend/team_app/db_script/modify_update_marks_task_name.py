def modify_update_marks_task_name(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    exam_module = Module.objects.get(path='examinations')
    update_marks_task = Task.objects.get(path='update_marks', parentModule=exam_module)
    update_marks_task.title = 'Update Marks'
    update_marks_task.save()
