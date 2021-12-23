def add_student_task_count(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='students')
    task_object = Task(path='count_all', title='Count All', orderNumber=14, parentModule=module_object)
    task_object.save()
