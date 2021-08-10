
from team_app.db_script.populate_app import populate_task_in_all_schools


def access_update_marks(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='examinations')

    task_object_one = Task(path='update_marks', title='Update marks', orderNumber=4, parentModule=module_object)
    task_object_one.save()

    task_list = []
    task_list.append(task_object_one)

    populate_task_in_all_schools(apps, task_list)
