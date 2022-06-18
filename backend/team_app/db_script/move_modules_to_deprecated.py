
def move_report_card_mp_board_to_deprecated(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    deprecated_module = Module.objects.get(path='deprecated')
    report_card_mp_board_module = Module.objects.get(path='report_card_mp_board')

    report_card_mp_board_tasks = Task.objects.filter(parentModule=report_card_mp_board_module)

    for report_card_mp_board_task in report_card_mp_board_tasks:
        report_card_mp_board_task.path = 'mp_rc_'+report_card_mp_board_task.path
        report_card_mp_board_task.parentModule = deprecated_module
        report_card_mp_board_task.title = 'MP RC - '+report_card_mp_board_task.title
        report_card_mp_board_task.save()

    report_card_mp_board_module.delete()


def move_report_card_cbse_to_deprecated(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    deprecated_module = Module.objects.get(path='deprecated')
    report_card_cbse_module = Module.objects.get(path='report_card_cbse')

    report_card_cbse_tasks = Task.objects.filter(parentModule=report_card_cbse_module)

    for report_card_cbse_task in report_card_cbse_tasks:
        report_card_cbse_task.path = 'cbse_rc_'+report_card_cbse_task.path
        report_card_cbse_task.parentModule = deprecated_module
        report_card_cbse_task.title = 'CBSE RC - '+report_card_cbse_task.title
        report_card_cbse_task.save()
    
    report_card_cbse_module.delete()
    

def move_expenses_to_deprecated(apps, schema_editor):

    Module = apps.get_model('team_app', 'Module')
    Task = apps.get_model('team_app', 'Task')

    deprecated_module = Module.objects.get(path='deprecated')
    expense_module = Module.objects.get(path='expenses')

    expense_tasks = Task.objects.filter(parentModule=expense_module)

    for expense_task in expense_tasks:
        expense_task.path = 'expense_'+expense_task.path
        expense_task.parentModule = deprecated_module
        expense_task.title = 'Expense - '+expense_task.title
        expense_task.save()

    expense_module.delete()
