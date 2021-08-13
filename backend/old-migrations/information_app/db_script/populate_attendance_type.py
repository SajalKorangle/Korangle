def populate_attendance_type(apps, schema_editor):
    MessageType = apps.get_model('information_app', 'MessageType')
    MessageType.objects.create(name='Attendance')
