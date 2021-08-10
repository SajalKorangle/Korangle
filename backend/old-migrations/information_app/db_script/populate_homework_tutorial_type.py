def populate_homework_tutorial_type(apps, schema_editor):
    MessageType = apps.get_model('information_app', 'MessageType')
    MessageType.objects.create(name='Homework')
    MessageType.objects.create(name='Tutorial')
