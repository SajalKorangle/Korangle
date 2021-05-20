def populate_sms_events(apps, schema_editor):
    sms_event = apps.get_model('sms_app', 'SMSEvent')
    new_sms_event = sms_event(eventName='General', defaultSMSContent='', defaultNotificationContent='')
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Notify Defaulters', defaultSMSContent='', defaultNotificationContent='')
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Tutorial Creation', defaultSMSContent="A new tutorial has been created in "
                                                                               "the Subject @subject; Chapter "
                                                                               "@tutorialChapter; Topic "
                                                                               "@tutorialTopic korngl",
                              defaultNotificationContent="A new tutorial has been created in the Subject @subject; "
                                                         "Chapter @tutorialChapter; Topic @tutorialTopic")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Tutorial Updation',
                              defaultSMSContent="The following tutorial has been edited -\n Topic @tutorialTopic; "
                                                "Subject @subject; Chapter @tutorialChapter korngl",
                              defaultNotificationContent="The following tutorial has been deleted -\n Topic "
                                                         "@tutorialTopic; Subject @subject; Chapter "
                                                         "@tutorialChapter")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Tutorial Deletion',
                              defaultSMSContent="The following tutorial has been deleted -\n Topic @tutorialTopic; "
                                                "Subject @subject; Chapter @tutorialChapter korngl",
                              defaultNotificationContent="The following tutorial has been edited -\n Topic "
                                                         "@tutorialTopic; Subject @subject; Chapter "
                                                         "@tutorialChapter")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Homework Creation',
                              defaultSMSContent="New Homework is added in @subject,Title -\n '@homeworkName' Last "
                                                "date to submit -\n @deadLine ",
                              defaultNotificationContent="New Homework is added in @subject,Title -\n "
                                                         "'@homeworkName' Last date to submit -\n @deadLine ")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Homework Updation',
                              defaultSMSContent="Please note, there are changes in the Homework '@homeworkName' of "
                                                "@subject' korngl",
                              defaultNotificationContent="Please note, there are changes in the Homework "
                                                         "'@homeworkName' of @subject'")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Homework Deletion',
                              defaultSMSContent="Please note, the homework '@homeworkName' of subject @subject has "
                                                "been removed korngl",
                              defaultNotificationContent="Please note, the homework '@homeworkName' of subject "
                                                         "@subject has been removed")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Homework Resubmission',
                              defaultSMSContent="Your Homework @homeworkName of Subject @subject has been asked for "
                                                "resubmission korngl",
                              defaultNotificationContent="Your Homework @homeworkName of Subject @subject has been "
                                                         "asked for resubmission")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Homework Checked',
                              defaultSMSContent="Your Homework @homeworkName of Subject @subject has been checked korngl",
                              defaultNotificationContent="Your Homework @homeworkName of Subject @subject has been "
                                                         "checked")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Attendance Creation',
                              defaultSMSContent="Your ward, @studentName is marked @attendanceStatus on @attendanceDate korngl",
                              defaultNotificationContent="Your ward, @studentName is marked @attendanceStatus on "
                                                         "@attendanceDate")
    new_sms_event.save()
    new_sms_event = sms_event(eventName='Attendance Updation',
                              defaultSMSContent="Your ward's attendance has been corrected to @attendanceStatus korngl",
                              defaultNotificationContent="Your ward's attendance has been corrected to "
                                                         "@attendanceStatus")
    new_sms_event.save()


