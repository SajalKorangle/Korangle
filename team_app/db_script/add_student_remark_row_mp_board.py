
def add_student_remark_row_mp_board(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Board = apps.get_model('school_app', 'Board')
    Task = apps.get_model('team_app', 'Task')

    mp_board_object = Board.objects.get(name='M.P. Board')

    module_object = Module.objects.get(path='report_card_mp_board',
                           title='Report Card',
                           icon='book',
                           orderNumber=8,
                           parentBoard=mp_board_object)
    
    # To find existing count
    count = Task.objects.filter(parentModule = module_object).count()
    count = count + 1
    
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