def populate_message_type(apps, schema_editor):
    MessageType = apps.get_model('information_app', 'MessageType')
    MessageType.objects.create(name='General')
    MessageType.objects.create(name='Defaulter')
    MessageType.objects.create(name='Fee Receipt')
