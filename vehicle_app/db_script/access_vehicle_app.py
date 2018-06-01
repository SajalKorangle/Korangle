
from team_app.db_script.populate_app import populate_in_all_schools_and_users, set_module_order


def access_vehicle_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='vehicle',
                           title='vehicle',
                           icon='directions_bus')
    module_object.save()

    task_object_one = Task(path='update_bus_stop', title='Update BusStop', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='delete_bus_stop', title='Delete BusStop', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_object_three = Task(path='add_bus_stop', title='Add BusStop', orderNumber=3, parentModule=module_object)
    task_object_three.save()

    task_list = []
    task_list.append(task_object_one)
    task_list.append(task_object_two)
    task_list.append(task_object_three)

    populate_in_all_schools_and_users(module_object, apps, task_list)

    set_module_order('students', 1, apps)
    set_module_order('fees', 2, apps)
    set_module_order('sms', 3, apps)
    set_module_order('vehicle', 4, apps)
    set_module_order('expenses', 5, apps)
    set_module_order('marksheet', 6, apps)
    set_module_order('employees', 7, apps)
    set_module_order('enquiries', 8, apps)
    set_module_order('school', 9, apps)
    set_module_order('team', 10, apps)
