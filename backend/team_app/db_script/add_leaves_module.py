def add_leaves_module(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    # extract feature Flag
    feature_flag_object = FeatureFlag.objects.filter(name='Leaves').first()
    # add entry into Module
    module_object = Module(path='leaves', title='Leaves', icon='exit_to_app',
                           parentBoard=None, parentFeatureFlag=feature_flag_object, orderNumber=1)
    module_object.save()
    # add entry into Task for leaves
    # manage_type
    manage_type = Task(parentModule=module_object, path='manage_type', title='Manage Types',
                       parentBoard=None, videoUrl='', parentFeatureFlag=feature_flag_object, orderNumber=1)
    manage_type.save()
    # add entry for employee permission for all tasks in Leaves
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = manage_type
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

def add_manage_plans(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    # extract feature Flag
    feature_flag_object = FeatureFlag.objects.filter(name='Leaves').first()
    # filter module
    module_object = Module.objects.filter(title='Leaves')[0]
    # add entry into Task for leaves
    # manage_plan
    manage_plan = Task(parentModule=module_object, path='manage_plan', title='Manage Plans',
                       parentBoard=None, videoUrl='', parentFeatureFlag=feature_flag_object, orderNumber=2)
    manage_plan.save()
    # add entry for employee permission for all tasks in Leaves
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = manage_plan
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()

def add_manage_leave_plans(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    # extract feature Flag
    feature_flag_object = FeatureFlag.objects.filter(name='Leaves').first()
    # filter module
    module_object = Module.objects.filter(title='Leaves')[0]
    # add entry into Task for leaves
    # manage_plan
    manage_leave_plan = Task(parentModule=module_object, path='manage_leave_plan', title='Manage Leave Plans',
                       parentBoard=None, videoUrl='', parentFeatureFlag=feature_flag_object, orderNumber=2)
    manage_leave_plan.save()
    # add entry for employee permission for all tasks in Leaves
    for employee_permission in EmployeePermission.objects.filter(parentTask__path='assign_task'):
        employee = EmployeePermission()
        employee.parentTask = manage_leave_plan
        employee.parentEmployee = employee_permission.parentEmployee
        employee.save()