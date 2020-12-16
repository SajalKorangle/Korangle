
def add_settings_task(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='homework')

    task_object_one = Task(path='settings', title='Settings', orderNumber=4, parentModule=module_object)
    task_object_one.save()

    # populate_task_in_all_schools_and_users(module_object, task_object_one, apps)
