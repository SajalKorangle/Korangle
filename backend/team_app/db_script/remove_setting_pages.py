def remove_setting_pages(apps, schema_editor):
    employee_permission = apps.get_model('employee_app', 'EmployeePermission')
    task = apps.get_model('team_app', 'Task')

    employee_permission.objects.filter(parentTask__parentModule__path='homework', parentTask__path='settings').delete()
    employee_permission.objects.filter(parentTask__parentModule__path='tutorials', parentTask__path='settings').delete()
    employee_permission.objects.filter(parentTask__parentModule__path='attendance',
                                       parentTask__path='settings').delete()

    task.objects.get(parentModule__path='homework', path='settings').delete()
    task.objects.get(parentModule__path='tutorials', path='settings').delete()
    task.objects.get(parentModule__path='attendance', path='settings').delete()
