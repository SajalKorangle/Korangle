

def add_mp_board_report_card_module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Board = apps.get_model('school_app', 'Board')
    Task = apps.get_model('team_app', 'Task')

    mp_board_object = Board.objects.get(name='M.P. Board')

    module_object = Module(path='report_card_mp_board',
                           title='Report Card',
                           icon='book',
                           orderNumber=8,
                           parentBoard=mp_board_object)
    module_object.save()

    task_title_list = ['Update CCE marks', 'Grade Student Fields', 'Set Final Report',
                       'Generate Final Report', 'Generate Patrak', 'Generate Goshwara']
    for task_object in Task.objects.filter(parentModule__path='examinations',
                                           title__in=task_title_list):
        task_object.parentBoard = mp_board_object
        task_object.parentModule = module_object
        task_object.save()

