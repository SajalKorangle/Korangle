def fix_crroupt_sms(app, schema_editor):
    SMS = app.get_model('sms_app', 'SMS')
    for sms in SMS.objects.all():
        if sms.content.find(chr(0x00))>=0:
            sms.content = sms.content.replace(chr(0x00), ' ')
            sms.save()