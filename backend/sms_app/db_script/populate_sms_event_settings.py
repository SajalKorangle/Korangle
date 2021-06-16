def populate_sms_event_settings(apps, schema_editor):
    sms_event_settings = apps.get_model('sms_app', 'SMSEventSettings')
    sent_update_type = apps.get_model('information_app', 'SentUpdateType')

    # Attendance Settings:
    attendance_settings = apps.get_model('attendance_app', 'AttendanceSettings')

    for settings in attendance_settings.objects.all():
        new_creation_event = sms_event_settings(SMSEventFrontEndId=3,
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType),
                                                receiverType=settings.receiverType)

        new_creation_event.save()
        new_updation_event = sms_event_settings(SMSEventFrontEndId=4,
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType),
                                                receiverType=settings.receiverType)
        new_updation_event.save()

    # Tutorial Settings:
    tutorial_settings = apps.get_model('tutorial_app', 'TutorialSettings')

    for settings in tutorial_settings.objects.all():
        new_creation_event = sms_event_settings(SMSEventFrontEndId=10,
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=settings.sentUpdateType)
        new_creation_event.save()

        new_updation_event = sms_event_settings(SMSEventFrontEndId=11,
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=settings.sentUpdateType)
        new_updation_event.save()

        new_deletion_event = sms_event_settings(SMSEventFrontEndId=12,
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=settings.sentUpdateType)
        new_deletion_event.save()

    # HomeWork Settings:
    homework_settings = apps.get_model('homework_app', 'HomeworkSettings')

    for settings in homework_settings.objects.all():
        new_creation_event = sms_event_settings(SMSEventFrontEndId=5,
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType))
        new_creation_event.save()

        new_updation_event = sms_event_settings(SMSEventFrontEndId=6,
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType))
        new_updation_event.save()

        new_deletion_event = sms_event_settings(SMSEventFrontEndId=7,
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType))
        new_deletion_event.save()

        new_checked_event = sms_event_settings(SMSEventFrontEndId=8,
                                               parentSchool=settings.parentSchool,
                                               parentSentUpdateType=sent_update_type.objects.get(
                                                   name=settings.sentUpdateType))
        new_checked_event.save()

        new_resubmission_event = sms_event_settings(SMSEventFrontEndId=9,
                                                    parentSchool=settings.parentSchool,
                                                    parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType))
        new_resubmission_event.save()
