
from team_app.db_script.populate_app import set_task_order


def transfer_permission_to_employee_profile(apps, schema_editor):
    
    delete_old_users(apps, schema_editor)
    change_username_to_mobile_numbers(apps, schema_editor)
    create_employee_profile_for_every_member(apps, schema_editor)
    transfer_member_permissions_to_employee_permissions(apps, schema_editor)
    add_assign_task_task(apps, schema_editor)
    give_assign_task_permission(apps, schema_editor)


def delete_old_users(apps, schema_editor):

    User = apps.get_model('auth', 'User')

    User.objects.filter(username__in=['arnava', 'brightstar', 'brighthindi', 'brightstarsalsalai']).delete()


def change_username_to_mobile_numbers(apps, schema_editor):

    profile_array = [
        ['anupreet', 9425083104, 'Anil', 'Agrawal'],
        ['nainish', 9926085773, 'Nainish', 'Mehta'],
        ['devendra', 7692947706, 'Devendra', ''],
        ['praveen', 9039720764, 'Praveen', ''],
        ['rahul', 9584256522, 'Rahul', 'Tailor'],
        ['eklavya', 9907056160, 'Himanshu', ''],
        ['demo', 9425921504, 'Preeti', 'Agrawal'],
        ['madhav', 7898373639, 'Lakhan', 'Parmar'],
        ['talent', 9754683181, 'Rakesh', 'Mewada'],
        ['champion', 8770176906, 'Ashish', 'Vaishya'],
        ['bhagatsingh', 7974252055, 'Rina', 'Thakur'],
        ['harshal', 7999951154, 'Harshal', 'Agrawal']
    ]

    User = apps.get_model('auth', 'User')

    for profile in profile_array:

        user_object = User.objects.get(username=profile[0])
        user_object.username = profile[1]
        user_object.first_name = profile[2]
        user_object.last_name = profile[3]
        user_object.save()


def create_employee_profile_for_every_member(apps, schema_editor):

    School = apps.get_model('school_app', 'School')
    Member = apps.get_model('team_app', 'Member')
    Employee = apps.get_model('employee_app', 'Employee')

    for school in School.objects.all():
        for member in Member.objects.filter(parentSchool=school):
            if Employee.objects.filter(parentSchool=school, mobileNumber=member.parentUser.username).count() == 0:
                employee = Employee(name=member.parentUser.first_name +'  '+member.parentUser.last_name,
                                    fatherName=' - ',
                                    mobileNumber=member.parentUser.username,
                                    parentSchool=school)
                employee.save()


def transfer_member_permissions_to_employee_permissions(apps, schema_editor):
    
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    School = apps.get_model('school_app', 'School')
    Member = apps.get_model('team_app', 'Member')
    Permission = apps.get_model('team_app', 'Permission')
    Employee = apps.get_model('employee_app', 'Employee')
    
    for school in School.objects.all():
        for member in Member.objects.filter(parentSchool=school):
            employee = Employee.objects.get(parentSchool=school, mobileNumber=member.parentUser.username)
            for permission in Permission.objects.filter(parentSchool=school, parentUser=member.parentUser):
                employee_permission = EmployeePermission(parentTask=permission.parentTask,
                                                         parentEmployee=employee)
                employee_permission.save()


def add_assign_task_task(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='employees')

    task_object_one = Task(path='assign_task', title='Assign Task', orderNumber=1, parentModule=module_object)
    task_object_one.save()

    # populate_task_in_all_schools_and_users(module_object, task_object_one, apps)

    set_task_order('employees', 'update_profile', 1, apps)
    set_task_order('employees', 'view_all', 2, apps)
    set_task_order('employees', 'add_employee', 3, apps)
    set_task_order('employees', 'assign_task', 4, apps)


def give_assign_task_permission(apps, schema_editor):

    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    Task = apps.get_model('team_app', 'task')

    task = Task.objects.get(path='assign_task', parentModule__path='employees')

    for employee_permission in EmployeePermission.objects.filter(parentTask__parentModule__path='team',
                                                                 parentTask__path='assign_task'):
        new_employee_permission = EmployeePermission(parentTask=task,
                                                     parentEmployee=employee_permission.parentEmployee)
        new_employee_permission.save()


