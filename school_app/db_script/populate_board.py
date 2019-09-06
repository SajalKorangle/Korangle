

def populate_board(apps, schema_editor):

    Board = apps.get_model('school_app', 'Board')
    School = apps.get_model('school_app', 'School')

    mp_board_object = Board(name='M.P. Board')
    mp_board_object.save()

    cbse_board_object = Board(name='C.B.S.E.')
    cbse_board_object.save()

    id_list = [94,93,143,163]

    for school_object in School.objects.all():

        if school_object.id in id_list:
            school_object.parentBoard = cbse_board_object
            school_object.save()
        else:
            school_object.parentBoard = mp_board_object
            school_object.save()

