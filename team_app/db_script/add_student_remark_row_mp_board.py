
def add_student_remark_row_mp_board(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Board = apps.get_model('school_app', 'Board')
    EmployeePermission = apps.get_model('employee_app', 'EmployeePermission')
    Task = apps.get_model('team_app', 'Task')

    mp_board_object = Board.objects.get(name='M.P. Board')

    module_object = Module.objects.get(path='report_card_mp_board',
                           title='Report Card',
                           icon='book',
                           orderNumber=8,
                           parentBoard=mp_board_object)
    
    # To find existing count
    count = Task.objects.filter(parentModule = module_object).count()
    count = 11 # As observed from database
    
    task_title_list = [
      {'path':'add_student_remarks',
        'title':'Add Student Remarks',
      },
    ]

    for task_title in task_title_list:

        task_object = Task(parentModule=module_object,
                           path=task_title['path'],
                           title=task_title['title'],
                           orderNumber=count,
                           parentBoard=mp_board_object)
        task_object.save()
        print('Task Added')
        print(task_object.id)
        # Adding in employee permission
        emp_added_list = [] # To get unique employee id
        emp_per_list = EmployeePermission.objects.filter(parentEmployee__parentSchool__parentBoard__name='M.P. Board')
        for employee_permission_object in emp_per_list:
            if employee_permission_object.parentEmployee.id in emp_added_list:
                continue
            emp_added_list.append(employee_permission_object.parentEmployee.id)
            new_emp = EmployeePermission()
            new_emp.parentEmployee = employee_permission_object.parentEmployee
            new_emp.parentTask = task_object
            new_emp.save()