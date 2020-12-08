
from team_app.db_script.populate_app import populate_task_in_all_schools

def access_homework_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module(path='homework',
                           title='Homework',
                           orderNumber=12,
                           icon='assignment')
    module_object.save()

    data = [
        {
            'path' : 'issue_homework',
            'title' : 'Issue Homework',
            'orderNumber' : 1,
        },
        {
            'path': 'check_homework',
            'title': 'Check Homework',
            'orderNumber': 2,
        },
        {
            'path': 'view_report',
            'title': 'View Report',
            'orderNumber': 3,
        },
    ]

    task_list = []

    for task_data in data:
        task_object = Task(path=task_data['path'], title=task_data['title'],
                           orderNumber=task_data['orderNumber'], parentModule=module_object)
        task_object.save()
        task_list.append(task_object)

    populate_task_in_all_schools(apps, task_list)
