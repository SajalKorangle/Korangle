from feature_flag_app.constants.feature_flags import SCHOOL_WEBSITE_FEATURE_FLAG


def add_school_website_module_and_task(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    feature_flag_object = FeatureFlag.objects.get(name=SCHOOL_WEBSITE_FEATURE_FLAG)

    # add entry into Module
    website_module = Module(path='website', title='Website', icon='website',
                            parentBoard=None, parentFeatureFlag=feature_flag_object, orderNumber=1)
    website_module.save()
    # add entry into Task for leaves
    # manage_type
    manage_website_task = Task(parentModule=website_module, path='manage_website', title='Manage Website',
                               parentBoard=None, videoUrl='', parentFeatureFlag=feature_flag_object, orderNumber=1)
    manage_website_task.save()
    # add entries for employee who has assign task permission
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = manage_website_task
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()
