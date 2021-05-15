def change_notification_to_upper_case(apps, schema_editor):
    SentUpdateType = apps.get_model('information_app', 'SentUpdateType')
    notify = SentUpdateType.objects.get(name='Notification')
    notify.name = 'NOTIFICATION'
    notify.save()
