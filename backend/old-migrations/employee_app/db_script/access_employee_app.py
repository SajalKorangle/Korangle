
from team_app.db_script.populate_app import populate_in_all_schools_and_users


def access_employee_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='employees',
                           title='Employees',
                           icon='account_circle')
    module_object.save()

    task_object_one = Task(path='update_profile', title='Update Profile', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='view_all', title='View All', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_object_three = Task(path='add_employee', title='Add Employee', orderNumber=3, parentModule=module_object)
    task_object_three.save()

    task_list = []
    task_list.append(task_object_one)
    task_list.append(task_object_two)
    task_list.append(task_object_three)

    populate_in_all_schools_and_users(module_object, apps, task_list)
