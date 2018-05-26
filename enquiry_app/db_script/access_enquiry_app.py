
from team_app.db_script.populate_app import populate_in_all_schools_and_users, set_module_order


def access_enquiry_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='enquiries',
                           title='Enquiry',
                           icon='not_listed_location')
    module_object.save()

    task_object_one = Task(path='add_enquiry', title='Add Enquiry', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='view_all', title='View All', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_object_three = Task(path='update_enquiry', title='Update', orderNumber=3, parentModule=module_object)
    task_object_three.save()

    task_list = []
    task_list.append(task_object_one)
    task_list.append(task_object_two)
    task_list.append(task_object_three)

    populate_in_all_schools_and_users(module_object, apps, task_list)

    set_module_order('students', 1, apps)
    set_module_order('fees', 2, apps)
    set_module_order('expenses', 3, apps)
    set_module_order('marksheet', 4, apps)
    set_module_order('employees', 5, apps)
    set_module_order('enquiries', 6, apps)
    set_module_order('school', 7, apps)
    set_module_order('team', 8, apps)

    Module = apps.get_model('team_app', 'Module')
    module_object = Module.objects.get(path='school')
    module_object.icon = 'domain'
    module_object.save()


