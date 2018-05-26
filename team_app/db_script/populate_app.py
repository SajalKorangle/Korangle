

def populate_in_all_schools_and_users(module_object, apps, task_list):

    School = apps.get_model('school_app', 'School')
    Access = apps.get_model('team_app', 'Access')
    Member = apps.get_model('team_app', 'Member')
    Permission = apps.get_model('team_app', 'Permission')

    for school_object in School.objects.all():

        access_object = Access(parentModule=module_object,
                               parentSchool=school_object)
        access_object.save()

        for member_object in Member.objects.filter(parentSchool=school_object):

            for task_object in task_list:

                permission_object = Permission(parentTask=task_object,
                                               parentSchool=school_object,
                                               parentUser=member_object.parentUser)
                permission_object.save()


def set_module_order(module_path, orderNumber, apps):

    Module = apps.get_model('team_app', 'Module')

    module_object = Module.objects.get(path=module_path)
    module_object.orderNumber = orderNumber
    module_object.save()
