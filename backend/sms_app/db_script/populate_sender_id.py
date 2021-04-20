def populate_sender_id(apps, schema_editor):
    school = apps.get_model('school_app', 'School')
    sender_id = apps.get_model('sms_app', 'SenderId')

    new_sender_id = sender_id(parentSchool=school.objects.get(id=154), entityName='Harshal Agrawal',
                              entityRegistrationId='1001789907875138385', senderId='KORNGL',
                              senderRegistrationId='1005782167817961670', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    new_sender_id = sender_id(parentSchool=school.objects.get(id=116), entityName='Red Rose Hr. Sec. School',
                              entityRegistrationId='1001445360826452275', senderId='REDROS',
                              senderRegistrationId='1005270964229477700', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    new_sender_id = sender_id(parentSchool=school.objects.get(id=117), entityName='Red Rose Hr. Sec. School',
                              entityRegistrationId='1001445360826452275', senderId='REDROS',
                              senderRegistrationId='1005270964229477700', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    new_sender_id = sender_id(parentSchool=school.objects.get(id=118), entityName='Red Rose Hr. Sec. School',
                              entityRegistrationId='1001445360826452275', senderId='REDROS',
                              senderRegistrationId='1005270964229477700', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    new_sender_id = sender_id(parentSchool=school.objects.get(id=44), entityName='SAI NATH CONVENT HIGH SCHOOL',
                              entityRegistrationId='1001128236018796278', senderId='SNCSCH',
                              senderRegistrationId='1005067642012233557', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    new_sender_id = sender_id(parentSchool=school.objects.get(id=94), entityName='MAGADHAM INTERNATIONAL SCHOOL',
                              entityRegistrationId='1001540057500485193', senderId='MAGADM',
                              senderRegistrationId='1005737437661706173', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    # new_sender_id = sender_id(parentSchool=school.objects.get(id=93), entityName='MAGADHAM INTERNATIONAL SCHOOL',
    #                           entityRegistrationId='1001540057500485193', senderId='MAGADM',
    #                           senderRegistrationId='1005737437661706173', senderIdStatus='ACTIVATED')
    # new_sender_id.save()

    new_sender_id = sender_id(parentSchool=school.objects.get(id=33), entityName='Anupreet Pvt. ITI',
                              entityRegistrationId='1001248938015380050', senderId='ANUPRT',
                              senderRegistrationId='1005316295056149029', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    new_sender_id = sender_id(parentSchool=school.objects.get(id=13), entityName='Anupreet Pvt. ITI',
                              entityRegistrationId='1001248938015380050', senderId='ANUPRT',
                              senderRegistrationId='1005316295056149029', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    new_sender_id = sender_id(parentSchool=school.objects.get(id=71), entityName='K.R.INTERNATIONAL SCHOOL',
                              entityRegistrationId='1001162399836996315', senderId='KRISHL',
                              senderRegistrationId='1005731058962233480', senderIdStatus='ACTIVATED')
    new_sender_id.save()
    new_sender_id = sender_id(parentSchool=school.objects.get(id=103), entityName='Perfect public school',
                              entityRegistrationId='1001032819116902044', senderId='PERPUB',
                              senderRegistrationId='1005136919398276488', senderIdStatus='ACTIVATED')
    new_sender_id.save()
