def populate_sms_id(apps, schema_editor):
    school = apps.get_model('school_app', 'School')
    sms_id = apps.get_model('sms_app', 'SMSId')
    sms_id_school = apps.get_model('sms_app', 'SMSIdSchool')
    print("sms_id")
    sms_id.objects.create(entityName='Harshal Agrawal',
                          entityRegistrationId='1001789907875138385', smsId='KORNGL',
                          smsIdRegistrationNumber='1005782167817961670', smsIdStatus='ACTIVATED')

    sms_id.objects.create(entityName='Red Rose Hr. Sec. School',
                          entityRegistrationId='1001445360826452275', smsId='REDROS',
                          smsIdRegistrationNumber='1005270964229477700', smsIdStatus='ACTIVATED')

    sms_id.objects.create(entityName='SAI NATH CONVENT HIGH SCHOOL',
                          entityRegistrationId='1001128236018796278', smsId='SNCSCH',
                          smsIdRegistrationNumber='1005067642012233557', smsIdStatus='ACTIVATED')

    sms_id.objects.create(entityName='MAGADHAM INTERNATIONAL SCHOOL',
                          entityRegistrationId='1001540057500485193', smsId='MAGADM',
                          smsIdRegistrationNumber='1005737437661706173', smsIdStatus='ACTIVATED')

    sms_id.objects.create(entityName='Anupreet Pvt. ITI',
                          entityRegistrationId='1001248938015380050', smsId='ANUPRT',
                          smsIdRegistrationNumber='1005316295056149029', smsIdStatus='ACTIVATED')

    sms_id.objects.create(entityName='K.R.INTERNATIONAL SCHOOL',
                          entityRegistrationId='1001162399836996315', smsId='KRISHL',
                          smsIdRegistrationNumber='1005731058962233480', smsIdStatus='ACTIVATED')

    sms_id.objects.create(entityName='Perfect public school',
                          entityRegistrationId='1001032819116902044', smsId='PERPUB',
                          smsIdRegistrationNumber='1005136919398276488', smsIdStatus='ACTIVATED')

    sms_id_school.objects.create(parentSchool=school.objects.get(id=154),
                                 parentSMSId=sms_id.objects.get(smsId='KORNGL'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=116),
                                 parentSMSId=sms_id.objects.get(smsId='REDROS'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=117),
                                 parentSMSId=sms_id.objects.get(smsId='REDROS'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=118),
                                 parentSMSId=sms_id.objects.get(smsId='REDROS'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=93),
                                 parentSMSId=sms_id.objects.get(smsId='MAGADM'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=94),
                                 parentSMSId=sms_id.objects.get(smsId='MAGADM'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=13),
                                 parentSMSId=sms_id.objects.get(smsId='ANUPRT'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=33),
                                 parentSMSId=sms_id.objects.get(smsId='ANUPRT'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=103),
                                 parentSMSId=sms_id.objects.get(smsId='PERPUB'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=44),
                                 parentSMSId=sms_id.objects.get(smsId='SNCSCH'))

    sms_id_school.objects.create(parentSchool=school.objects.get(id=71),
                                 parentSMSId=sms_id.objects.get(smsId='KRISHL'))
