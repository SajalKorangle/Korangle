
from team_app.db_script.populate_app import populate_in_all_schools_and_users, set_module_order


def access_sms_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='sms',
                           title='SMS',
                           icon='sms')
    module_object.save()

    task_object_one = Task(path='send_sms', title='Send SMS', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='view_sent', title='View Sent', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_object_three = Task(path='view_purchases', title='View Purchases', orderNumber=3, parentModule=module_object)
    task_object_three.save()

    task_list = []
    task_list.append(task_object_one)
    task_list.append(task_object_two)
    task_list.append(task_object_three)

    populate_in_all_schools_and_users(module_object, apps, task_list)

    set_module_order('students', 1, apps)
    set_module_order('fees', 2, apps)
    set_module_order('sms', 3, apps)
    set_module_order('expenses', 4, apps)
    set_module_order('marksheet', 5, apps)
    set_module_order('employees', 6, apps)
    set_module_order('enquiries', 7, apps)
    set_module_order('school', 8, apps)
    set_module_order('team', 9, apps)
