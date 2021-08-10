def rename_lock_fees(apps, schema_editor):
    task = apps.get_model('team_app', 'task')
    lock_fee_page = task.objects.get(path='lock_fees', title='Lock Fees')
    lock_fee_page.title = 'Settings'
    lock_fee_page.save()
