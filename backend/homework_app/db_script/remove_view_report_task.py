
def remove_view_report_task(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='homework')
    task_object = Task.objects.get(path='view_report', parentModule=module_object)
    task_object.delete()

