
from team_app.db_script.populate_app import set_task_order, populate_task_in_all_schools_and_users


def add_my_collection_task(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='fees')

    task_object_one = Task(path='my_collection', title='My Collection', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    populate_task_in_all_schools_and_users(module_object, task_object_one, apps)

    set_task_order('fees', 'collect_fee', 1, apps)
    set_task_order('fees', 'my_collection', 2, apps)
    set_task_order('fees', 'total_collection', 3, apps)
    set_task_order('fees', 'school_fee_record', 4, apps)
    set_task_order('fees', 'update_student_fees', 5, apps)
    set_task_order('fees', 'give_discount', 6, apps)
    set_task_order('fees', 'total_discount', 7, apps)
    set_task_order('fees', 'set_school_fees', 8, apps)
    set_task_order('fees', 'approve_fees', 9, apps)
