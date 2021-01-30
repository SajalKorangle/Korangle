
from team_app.db_script.populate_app import populate_task_in_all_schools


def add_tutorial_settings_task(apps, schema_editor):
    
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='tutorials')

    task_object = Task(path='settings', title='Settings', orderNumber=2, parentModule=module_object)
    task_object.save()

    task_list = [] 
    task_list.append(task_object)
    
    populate_task_in_all_schools(apps, task_list)