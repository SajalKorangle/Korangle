
from team_app.db_script.populate_app import set_task_order, populate_task_in_all_schools_and_users


def add_view_record_task(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='salary')

    task_object_one = Task(path='view_record', title='View Record', orderNumber=3, parentModule=module_object)
    task_object_one.save()

    set_task_order('salary', 'generate_payslip', 1, apps)
    set_task_order('salary', 'record_payment', 2, apps)
    set_task_order('salary', 'view_record', 3, apps)
