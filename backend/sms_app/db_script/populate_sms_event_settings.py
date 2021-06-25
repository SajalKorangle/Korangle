def populate_sms_event_settings(apps, schema_editor):
    sent_update_type_list = {"NULL": 1, "SMS": 2, "NOTIFICATION": 3, "NOTIF./SMS": 4}
    sms_event_settings = apps.get_model('sms_app', 'SMSEventSettings')
    sms_template = apps.get_model('sms_app', 'SMSTemplate')
    sms_id_school = apps.get_model('sms_app', 'SMSIdSchool')

    for template in sms_template.objects.all():
        sms_id_school_list = sms_id_school.objects.filter(parentSMSId=template.parentSMSId)
        for sms_school in sms_id_school_list:
            print(sms_school.parentSchool.printName)
            sms_event_settings.objects.create(SMSEventFrontEndId=3,
                                              parentSchool=sms_school.parentSchool,
                                              parentSMSTemplate=template)

    # Attendance Settings:
    attendance_settings = apps.get_model('attendance_app', 'AttendanceSettings')

    for settings in attendance_settings.objects.all():
        sms_event_settings.objects.create(SMSEventFrontEndId=5,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType],
                                          receiverType=settings.receiverType)

        sms_event_settings.objects.create(SMSEventFrontEndId=6,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType],
                                          receiverType=settings.receiverType)

    # Tutorial Settings:
    tutorial_settings = apps.get_model('tutorial_app', 'TutorialSettings')

    for settings in tutorial_settings.objects.all():
        sms_event_settings.objects.create(SMSEventFrontEndId=12,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType.name.upper()])

        sms_event_settings.objects.create(SMSEventFrontEndId=13,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType.name.upper()])

        sms_event_settings.objects.create(SMSEventFrontEndId=14,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType.name.upper()])

    # HomeWork Settings:
    homework_settings = apps.get_model('homework_app', 'HomeworkSettings')

    for settings in homework_settings.objects.all():
        sms_event_settings.objects.create(SMSEventFrontEndId=7,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType])

        sms_event_settings.objects.create(SMSEventFrontEndId=8,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType])

        sms_event_settings.objects.create(SMSEventFrontEndId=9,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType])

        sms_event_settings.objects.create(SMSEventFrontEndId=10,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType])

        sms_event_settings.objects.create(SMSEventFrontEndId=11,
                                          parentSchool=settings.parentSchool,
                                          sendUpdateTypeFrontEndId=sent_update_type_list[
                                              settings.sentUpdateType])
