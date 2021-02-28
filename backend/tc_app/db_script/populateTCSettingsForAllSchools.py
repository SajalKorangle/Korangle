def populateTcSettings(apps,schema_editor):
    TCSettings = apps.get_model('tc_app', 'TransferCertificateSettings')
    School = apps.get_model('school_app', 'School')
    for school in School.objects.all():
        TCSettings.objects.create(parentSchool=school, parentFeeType=None)