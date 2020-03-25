
def add_set_roll_number_task_and_permission(apps,schema_editor):
    Task = apps.get_model('team_app', 'Task')
    Module = apps.get_model('team_app','Module')
    EmployeePermission = apps.get_model('employee_app','EmployeePermission')

    class_module = Module.objects.get(path='class')
    set_rollnumber = Task(path='set_rollnumber',title='Set Roll Number',orderNumber=3,parentModule=class_module)
    set_rollnumber.save()

    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
            permissionObject = EmployeePermission(parentTask=set_rollnumber, parentEmployee=employee_permission.parentEmployee)
            permissionObject.save()