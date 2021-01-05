def populate_sent_update_type(apps, schema_editor):
    SentUpdateType = apps.get_model('information_app', 'SentUpdateType')
    SentUpdateType.objects.create(name='NULL')
    SentUpdateType.objects.create(name='SMS')
    SentUpdateType.objects.create(name='Notification')
    SentUpdateType.objects.create(name='NOTIF./SMS')
