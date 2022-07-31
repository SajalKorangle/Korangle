def admin_user_permission_manage_complaints_page(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    module_object = Module.objects.get(path = 'complaints')
    task_object = Task.objects.get(path = 'manage_complaints', parentModule = module_object)

    for employee_permission in EmployeePermission.objects.filter(parentTask = task_object):
        employee_permission.configJSON = '{"userType":"admin"}'
        employee_permission.save()
