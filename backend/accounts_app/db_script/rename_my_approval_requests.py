def rename_my_approval_requests(apps, schema_editor):
    task = apps.get_model('team_app', 'task')
    my_approval_page = task.objects.get(path='my_approval_requests', title='My Approval Requests')
    my_approval_page.path = 'request_approval'
    my_approval_page.title = 'Request Approval'
    my_approval_page.save()
