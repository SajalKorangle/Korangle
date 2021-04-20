def populate_sms_event_settings(apps, schema_editor):
    sms_event_settings = apps.get_model('sms_app', 'SMSEventSettings')
    sms_event = apps.get_model('sms_app', 'SMSEvent')
    sent_update_type = apps.get_model('information_app', 'SentUpdateType')

    # Attendance Settings:
    attendance_settings = apps.get_model('attendance_app', 'AttendanceSettings')

    for settings in attendance_settings.objects.all():
        new_creation_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Attendance Creation'),
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType),
                                                receiverType=settings.receiverType)

        new_creation_event.save()
        new_updation_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Attendance Updation'),
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType),
                                                receiverType=settings.receiverType)
        new_updation_event.save()

    # Tutorial Settings:
    tutorial_settings = apps.get_model('tutorial_app', 'TutorialSettings')

    for settings in tutorial_settings.objects.all():
        new_creation_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Tutorial Creation'),
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=settings.sentUpdateType)
        new_creation_event.save()

        new_updation_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Tutorial Updation'),
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=settings.sentUpdateType)
        new_updation_event.save()

        new_deletion_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Tutorial Deletion'),
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=settings.sentUpdateType)
        new_deletion_event.save()

    # HomeWork Settings:
    homework_settings = apps.get_model('homework_app', 'HomeworkSettings')

    for settings in homework_settings.objects.all():
        new_creation_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Homework Creation'),
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType))
        new_creation_event.save()

        new_updation_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Homework Updation'),
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType))
        new_updation_event.save()

        new_deletion_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Homework Deletion'),
                                                parentSchool=settings.parentSchool,
                                                parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType))
        new_deletion_event.save()

        new_checked_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Homework Checked'),
                                               parentSchool=settings.parentSchool,
                                               parentSentUpdateType=sent_update_type.objects.get(
                                                   name=settings.sentUpdateType))
        new_checked_event.save()

        new_resubmission_event = sms_event_settings(parentSMSEvent=sms_event.objects.get(eventName='Homework '
                                                                                                   'Resubmission'),
                                                    parentSchool=settings.parentSchool,
                                                    parentSentUpdateType=sent_update_type.objects.get(
                                                    name=settings.sentUpdateType))
        new_resubmission_event.save()
