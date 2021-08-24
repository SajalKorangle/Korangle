
from team_app.db_script.populate_app import populate_in_all_schools, set_module_order


def access_examination_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='examinations',
                           title='Examination',
                           icon='airline_seat_recline_normal')
    module_object.save()

    task_object_one = Task(path='create_examination', title='Create Exam', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='create_test', title='Create Test', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_object_three = Task(path='generate_hall_ticket', title='Generate Hall Ticket', orderNumber=3, parentModule=module_object)
    task_object_three.save()

    task_list = []
    task_list.append(task_object_one)
    task_list.append(task_object_two)
    task_list.append(task_object_three)

    populate_in_all_schools(module_object, apps, task_list)

    set_module_order('sms', 4, apps)
    set_module_order('attendance', 5, apps)
    set_module_order('employees', 6, apps)
    set_module_order('subjects', 7, apps)
    set_module_order('examinations', 8, apps)
    set_module_order('marksheet', 9, apps)
    set_module_order('salary', 10, apps)
    set_module_order('expenses', 11, apps)
    set_module_order('enquiries', 12, apps)
    set_module_order('vehicle', 13, apps)
    set_module_order('school', 14, apps)

