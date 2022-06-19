
def add_deprecated_Module(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')

    module_object = Module(path = 'deprecated', title = 'Deprecated', icon = 'work_off', orderNumber = 50, parentBoard = None)
    module_object.save()

def add_deprecated_Tasks(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    deprecated_module = Module.objects.get(path='deprecated')
    student_module = Module.objects.get(path='students')
    examination_module = Module.objects.get(path='examinations')

    generate_tc_task = Task.objects.get(path='generate_tc',parentModule=student_module)
    i_cards_task = Task.objects.get(path='i_cards',parentModule=student_module)
    print_marksheet_task = Task.objects.get(path='print_marksheet',parentModule=examination_module)

    generate_tc_task.parentModule = deprecated_module
    generate_tc_task.path = 'student_generate_tc'
    generate_tc_task.title = 'Student - Generate TC'
    generate_tc_task.save()

    i_cards_task.parentModule = deprecated_module
    i_cards_task.path = 'student_i_cards'
    i_cards_task.title = 'Student - Generate I-Card'
    i_cards_task.save()

    print_marksheet_task.parentModule = deprecated_module
    print_marksheet_task.path = 'examination_print_marksheet'
    print_marksheet_task.title = 'Examination - Print Marksheet'
    print_marksheet_task.save()
    