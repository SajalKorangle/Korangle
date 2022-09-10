
def remove_id_card_module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    id_card_module = Module.objects.get(path='id_card')
    id_card_tasks = Task.objects.filter(parentModule=id_card_module)

    for id_card_task in id_card_tasks:
        EmployeePermission.objects.filter(parentTask=id_card_task).delete()
        id_card_task.delete()

    id_card_module.delete()
