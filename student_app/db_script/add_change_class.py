
from team_app.db_script.populate_app import set_task_order, populate_task_in_all_schools_and_users


def add_change_class(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='students')

    task_object_one = Task(path='change_class', title='Change Class', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    populate_task_in_all_schools_and_users(module_object, task_object_one, apps)

    set_task_order('students', 'update_profile', 1, apps)
    set_task_order('students', 'view_all', 2, apps)
    set_task_order('students', 'generate_tc', 3, apps)
    set_task_order('students', 'promote_student', 4, apps)
    set_task_order('students', 'change_class', 5, apps)
    set_task_order('students', 'add_student', 6, apps)
