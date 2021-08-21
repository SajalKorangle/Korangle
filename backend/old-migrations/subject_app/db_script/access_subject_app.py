
from team_app.db_script.populate_app import populate_in_all_schools


def access_subject_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='subjects',
                           title='Subjects',
                           icon='category')
    module_object.save()

    task_object_one = Task(path='set_class_subject', title='Set Class Subject', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='set_student_subject', title='Set Student Subject', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_list = []
    task_list.append(task_object_one)
    task_list.append(task_object_two)

    populate_in_all_schools(module_object, apps, task_list)
