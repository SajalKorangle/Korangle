
from team_app.db_script.populate_app import populate_in_all_schools_and_users, set_module_order


def access_attendance_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='attendance',
                           title='Attendance',
                           orderNumber=3,
                           icon='date_range')
    module_object.save()

    data = [
        {
            'path' : 'record_attendance',
            'title' : 'Record Attendance',
            'orderNumber' : 1,
        },
        {
            'path' : 'view_class_attendance',
            'title' : 'View Class Atten.',
            'orderNumber' : 2,
        },
        {
            'path': 'view_student_attendance',
            'title': 'View Student Atten.',
            'orderNumber': 3,
        },
        {
            'path': 'declare_holidays',
            'title': 'Declare Holidays',
            'orderNumber': 4,
        },
        {
            'path': 'give_permissions',
            'title': 'Give Permissions',
            'orderNumber': 5,
        },
    ]

    task_list = []

    for task_data in data:
        task_object = Task(path=task_data['path'], title=task_data['title'],
                           orderNumber=task_data['orderNumber'], parentModule=module_object)
        task_object.save()
        task_list.append(task_object)

    populate_in_all_schools_and_users(module_object, apps, task_list)

    set_module_order('sms', 4, apps)
    set_module_order('marksheet', 5, apps)
    set_module_order('vehicle', 6, apps)
    set_module_order('expenses', 7, apps)
    set_module_order('employees', 8, apps)
    set_module_order('enquiries', 9, apps)
    set_module_order('school', 10, apps)
    set_module_order('team', 11, apps)
