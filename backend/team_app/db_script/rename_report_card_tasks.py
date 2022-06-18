
def rename_report_card_tasks(apps, schema_editor):

    Task = apps.get_model('team_app', 'Task')
    report_card_tasks = Task.objects.all()

    for report_card_task in report_card_tasks:

        if report_card_task.path.startswith('MP_RC_'):
            report_card_task.path = 'mp_rc_'+report_card_task.path[6:]
            report_card_task.title = 'MP RC - '+report_card_task.title
            report_card_task.save()

        if report_card_task.path.startswith('CBSE_RC_'):
            report_card_task.path = 'cbse_rc_'+report_card_task.path[8:]
            report_card_task.title = 'CBSE RC - '+report_card_task.title
            report_card_task.save()
