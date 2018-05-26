

def access_enquiry_app(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    Access = apps.get_model('team_app', 'Access')
    Permission = apps.get_model('team_app', 'Permission')
    School = apps.get_model('school_app', 'School')
    User = apps.get_model('auth', 'User')

    module_object = Module(path='enquiries',
                           title='Enquiry',
                           icon='not_listed_location')
    module_object.save()

    task_object_one = Task(path='add_enquiry', title='Add Enquiry', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    task_object_two = Task(path='view_all', title='View All', orderNumber=2, parentModule=module_object)
    task_object_two.save()

    task_object_three = Task(path='update_enquiry', title='Update', orderNumber=3, parentModule=module_object)
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

    set_module_order('students', 1, apps)
    set_module_order('fees', 2, apps)
    set_module_order('expenses', 3, apps)
    set_module_order('marksheet', 4, apps)
    set_module_order('employees', 5, apps)
    set_module_order('enquiries', 6, apps)
    set_module_order('school', 7, apps)
    set_module_order('team', 8, apps)

    Module = apps.get_model('team_app', 'Module')
    module_object = Module.objects.get(path='school')
    module_object.icon = 'domain'
    module_object.save()


def set_module_order(module_path, orderNumber, apps):

    Module = apps.get_model('team_app', 'Module')

    module_object = Module.objects.get(path=module_path)
    module_object.orderNumber = orderNumber
    module_object.save()
