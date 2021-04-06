def lock_fees_migration(apps, schema_editor):
    FeeSettings = apps.get_model('fees_third_app', 'FeeSettings')
    LockFee = apps.get_model('fees_third_app', 'LockFee')
    
    allLockFeeList = LockFee.objects.all()
    for lockFee in allLockFeeList:
        FeeSettings.objects.create(parentSchool=lockFee.parentSchool,
                parentSession=lockFee.parentSession, sessionLocked=True, )
