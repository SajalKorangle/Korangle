
from team_app.db_script.populate_app import populate_task_in_all_schools_and_users


def adding_i_card_page(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='students', title='Students')

    task_object_one = Task(path='i_cards', title='Generate I-Card', orderNumber=8, parentModule=module_object)
    task_object_one.save()

    populate_task_in_all_schools_and_users(module_object, task_object_one, apps)
