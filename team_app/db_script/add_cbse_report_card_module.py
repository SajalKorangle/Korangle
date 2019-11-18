

def add_cbse_report_card_module(apps, schema_editor):
    Module = apps.get_model('team_app', 'Module')
    Board = apps.get_model('school_app', 'Board')
    Task = apps.get_model('team_app', 'Task')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    cbse_object = Board.objects.get(name='C.B.S.E.')

    module_object = Module(path='report_card_cbse',
                           title='Report Card',
                           icon='book',
                           orderNumber=8,
                           parentBoard=cbse_object)
    module_object.save()

    task_title_list = ['Grade Student Fields', 'Set Final Report', 'Generate Final Report']

    count = 1
    for task_title in task_title_list:

        task_object = Task(parentModule=module_object,
                           path=Task.objects.filter(title=task_title)[0].path,
                           title=task_title,
                           orderNumber=count,
                           parentBoard=cbse_object)
        task_object.save()

        for employee_permission_object in \
                EmployeePermission.objects.filter(parentEmployee__parentSchool__parentBoard__name='C.B.S.E.',
                                                  parentTask__parentModule__path='report_card_mp_board',
                                                  parentTask__title=task_title):
            employee_permission_object.parentTask = task_object
            employee_permission_object.save()

        count = count + 1

    remove_cbse_employee_unnecessary_permissions(apps)


def remove_cbse_employee_unnecessary_permissions(apps):

    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')

    task_title_list = ['Update CCE marks', 'Generate Patrak', 'Generate Goshwara']
    EmployeePermission.objects.filter(parentEmployee__parentSchool__parentBoard__name='C.B.S.E.',
                                      parentTask__parentModule__path='report_card_mp_board',
                                      parentTask__title__in=task_title_list).delete()


