

def access_employee_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    Access = apps.get_model('team_app', 'Access')
    Permission = apps.get_model('team_app', 'Permission')
    School = apps.get_model('school_app', 'School')
    User = apps.get_model('auth', 'User')

    module_object = Module(path='employees',
                           title='Employees',
                           icon='account_circle')
    module_object.save()

    task_object_one = Task(path='update_profile', title='Update Profile', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='view_all', title='View All', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_object_three = Task(path='add_employee', title='Add Employee', orderNumber=3, parentModule=module_object)
    task_object_three.save()

    school_object = School.objects.get(name='B. Salsalai')

    access_object = Access(parentModule=module_object,
                           parentSchool=school_object)
    access_object.save()

    user_object = User.objects.get(username='nainish')

    permission_object = Permission(parentTask=task_object_one,
                                   parentSchool=school_object,
                                   parentUser=user_object)
    permission_object.save()

    permission_object = Permission(parentTask=task_object_two,
                                   parentSchool=school_object,
                                   parentUser=user_object)
    permission_object.save()

    permission_object = Permission(parentTask=task_object_three,
                                   parentSchool=school_object,
                                   parentUser=user_object)
    permission_object.save()
