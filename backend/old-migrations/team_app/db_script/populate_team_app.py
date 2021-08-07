

def populate_team_app(apps, schema_editor):

    populate_member_table(apps)

    populate_module_table(apps)

    populate_task_table(apps)

    School = apps.get_model('school_app', 'School')

    for school_object in School.objects.all():
        if school_object.name == 'EKLAVYA' or school_object.name == 'SBS':
            give_app_access(school_object.name, True, apps)
        else:
            give_app_access(school_object.name, False, apps)

    # give_user_access('nainish', 'BRIGHT STAR', apps, schema_editor)
    # give_user_access('brightstar', 'BRIGHT Hindi', apps, schema_editor)
    # give_user_access('brightstar', 'B. Salsalai', apps, schema_editor)


def give_app_access(school_name, marksheetToo, apps):

    give_school_access(school_name, 'students', apps)
    give_school_access(school_name, 'fees', apps)
    give_school_access(school_name, 'expenses', apps)
    give_school_access(school_name, 'school', apps)
    give_school_access(school_name, 'team', apps)

    if marksheetToo:
        give_school_access(school_name, 'marksheet', apps)


def populate_member_table(apps):

    Member = apps.get_model('team_app', 'Member')
    School = apps.get_model('school_app', 'School')

    for school_object in School.objects.all():

        user_object = school_object.user.all()[0]

        member_object = Member(parentSchool=school_object, parentUser=user_object)
        member_object.save()


def populate_module_table(apps):

    Module = apps.get_model('team_app', 'Module')

    module_object = Module(path='students', title='Students', icon='account_circle', orderNumber=1)
    module_object.save()

    module_object = Module(path='fees', title='Fees', icon='receipt', orderNumber=2)
    module_object.save()

    module_object = Module(path='expenses', title='Expenses', icon='dashboard', orderNumber=3)
    module_object.save()

    module_object = Module(path='marksheet', title='Marksheet', icon='dashboard', orderNumber=4)
    module_object.save()

    module_object = Module(path='school', title='School', icon='dashboard', orderNumber=5)
    module_object.save()

    module_object = Module(path='team', title='Team', icon='group', orderNumber=6)
    module_object.save()


def populate_task_table(apps):

    populate_student_module_task(apps)

    populate_fees_module_task(apps)

    populate_expenses_module_task(apps)

    populate_marksheet_module_task(apps)

    populate_school_module_task(apps)

    populate_team_module_task(apps)


def populate_student_module_task(apps):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='students')

    task_object = Task(path='update_profile', title='Update Profile', orderNumber=1, parentModule=module_object)
    task_object.save()

    task_object = Task(path='view_all', title='View All', orderNumber=2, parentModule=module_object)
    task_object.save()

    task_object = Task(path='generate_tc', title='Generate TC', orderNumber=3, parentModule=module_object)
    task_object.save()

    task_object = Task(path='promote_student', title='Promote Student', orderNumber=4, parentModule=module_object)
    task_object.save()

    task_object = Task(path='add_student', title='Add Student', orderNumber=5, parentModule=module_object)
    task_object.save()


def populate_fees_module_task(apps):
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='fees')

    task_object = Task(path='collect_fee', title='Collect Fee', orderNumber=1, parentModule=module_object)
    task_object.save()

    task_object = Task(path='total_collection', title='Total Collection', orderNumber=2, parentModule=module_object)
    task_object.save()

    task_object = Task(path='school_fee_record', title='School Fee Record', orderNumber=3, parentModule=module_object)
    task_object.save()

    task_object = Task(path='update_student_fees', title='Update Student Fees', orderNumber=4, parentModule=module_object)
    task_object.save()

    task_object = Task(path='give_discount', title='Give Discount', orderNumber=5, parentModule=module_object)
    task_object.save()

    task_object = Task(path='total_discount', title='Total Discount', orderNumber=6, parentModule=module_object)
    task_object.save()

    task_object = Task(path='set_school_fees', title='Set School Fees', orderNumber=7, parentModule=module_object)
    task_object.save()

    task_object = Task(path='approve_fees', title='Approve Fees', orderNumber=8, parentModule=module_object)
    task_object.save()


def populate_expenses_module_task(apps):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='expenses')

    task_object = Task(path='add_expense', title='Add Expense', orderNumber=1, parentModule=module_object)
    task_object.save()

    task_object = Task(path='expense_list', title='Total Expense', orderNumber=2, parentModule=module_object)
    task_object.save()


def populate_marksheet_module_task(apps):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='marksheet')

    task_object = Task(path='update_marks', title='Update Marks', orderNumber=1, parentModule=module_object)
    task_object.save()

    task_object = Task(path='print_marksheet', title='Print Marksheet', orderNumber=2, parentModule=module_object)
    task_object.save()


def populate_school_module_task(apps):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='school')

    task_object = Task(path='update_profile', title='Update Profile', orderNumber=1, parentModule=module_object)
    task_object.save()


def populate_team_module_task(apps):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    module_object = Module.objects.get(path='team')

    task_object = Task(path='add_member', title='Add Member', orderNumber=1, parentModule=module_object)
    task_object.save()

    task_object = Task(path='assign_task', title='Assign Task', orderNumber=2, parentModule=module_object)
    task_object.save()

    task_object = Task(path='remove_member', title='Remove Member', orderNumber=3, parentModule=module_object)
    task_object.save()


def give_school_access(school_name, module_path, apps):

    School = apps.get_model('school_app', 'School')
    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')
    Access = apps.get_model('team_app', 'Access')
    Permission = apps.get_model('team_app', 'Permission')

    school_object = School.objects.get(name=school_name)
    user_object = school_object.user.all()[0]
    module_object = Module.objects.get(path=module_path)

    access_object = Access(parentSchool=school_object, parentModule=module_object)
    access_object.save()

    for task_object in Task.objects.filter(parentModule=module_object):
        permission_object = Permission(parentUser=user_object, parentSchool=school_object, parentTask=task_object)
        permission_object.save()


def give_user_access(username, school_name, apps, schema_editor):

    School = apps.get_model('school_app', 'School')
    Member = apps.get_model('team_app', 'Member')
    Access = apps.get_model('team_app', 'Access')
    Task = apps.get_model('team_app', 'Task')
    Permission = apps.get_model('team_app', 'Permission')
    User = apps.get_model('auth', 'User')

    school_object = School.objects.get(name=school_name)
    user_object = User.objects.get(username=username)

    member_object = Member(parentSchool=school_object, parentUser=user_object)
    member_object.save()

    for access_object in Access.objects.filter(parentSchool=school_object):

        for task_object in Task.objects.filter(parentModule=access_object.parentModule):

            permission_object = Permission(parentSchool=school_object, parentUser=user_object, parentTask=task_object)
            permission_object.save()