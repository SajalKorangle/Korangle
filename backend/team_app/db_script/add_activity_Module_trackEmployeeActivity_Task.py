def add_activity_Module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='activity',title='Activity',icon='assignment',orderNumber=5,parentBoard=None)
    module_object.save()

    add_track_employee_activity_task(apps, module_object)


def add_track_employee_activity_task(apps, module_object):

    Task = apps.get_model('team_app', 'Task')

    task_object = Task(path='track_employee_activity', parentModule=module_object, title='Track Employee Activity', orderNumber=1, parentBoard=None)
    task_object.save()
