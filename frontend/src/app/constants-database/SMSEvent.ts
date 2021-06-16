class SMSEventStructure {

    static getStructure(id: number, eventName: string, defaultSMSContent: string, defaultNotificationContent: string) {
        return {
            id: id,
            eventName: eventName,
            defaultSMSContent: defaultSMSContent,
            defaultNotificationContent: defaultNotificationContent,
        };
    }
}


export const SMS_EVENTS = [
    SMSEventStructure.getStructure(1, 'General SMS', '', ''),
    SMSEventStructure.getStructure(2, 'Notify Defaulters', '', ''),
    SMSEventStructure.getStructure(3, 'Attendance Creation', 'Your ward, {#studentName#} is marked {#attendanceStatus#} on {#attendanceDate#} korngl', 'Your ward, {#studentName#} is marked {#attendanceStatus#} on {#attendanceDate#}'),
    SMSEventStructure.getStructure(4, 'Attendance Updation', 'Your ward\'s attendance has been corrected to {#attendanceStatus#} korngl', 'Your ward\'s attendance has been corrected to {#attendanceStatus#} korngl'),
    SMSEventStructure.getStructure(5, 'Homework Creation', 'New Homework is added in {#subject#},Title -\n \'{#homeworkName#}\' Last date to submit -\n {#deadLine#}', 'New Homework is added in {#subject#},Title -\n \'{#homeworkName#}\' Last date to submit -\n {#deadLine#}'),
    SMSEventStructure.getStructure(6, 'Homework Updation', 'Please note, there are changes in the Homework \'{#homeworkName#}\' of {#subject#}\' korngl', 'Please note, there are changes in the Homework \'{#homeworkName#}\' of {#subject#}\''),
    SMSEventStructure.getStructure(7, 'Homework Deletion', 'Please note, the homework \'{#homeworkName#}\' of subject {#subject#} has been removed korngl', 'Please note, the homework \'{#homeworkName#}\' of subject {#subject#} has been removed'),
    SMSEventStructure.getStructure(8, 'Homework Checked', 'Your Homework {#homeworkName#} of Subject {#subject#} has been checked korngl', 'Your Homework {#homeworkName#} of Subject {#subject#} has been checked'),
    SMSEventStructure.getStructure(9, 'Homework Resubmission', 'Your Homework {#homeworkName#} of Subject {#subject#} has been asked for resubmission korngl', 'Your Homework {#homeworkName#} of Subject {#subject#} has been asked for resubmission'),
    SMSEventStructure.getStructure(10, 'Tutorial Creation', 'A new tutorial has been created in the Subject {#subject#};', 'A new tutorial has been created in the Subject {#subject#};'),
    SMSEventStructure.getStructure(11, 'Tutorial Updation', 'The following tutorial has been edited -\n Topic {#tutorialTopic#}; Subject {#subject#}; Chapter {#tutorialChapter#} korngl', 'The following tutorial has been edited -\n Topic {#tutorialTopic#}; Subject {#subject#}; Chapter {#tutorialChapter#}'),
    SMSEventStructure.getStructure(12, 'Tutorial Deletion', 'The following tutorial has been deleted -\n Topic {#tutorialTopic#}; korngl', 'The following tutorial has been deleted -\n Topic {#tutorialTopic#};'),
    SMSEventStructure.getStructure(13, 'Event Gallery Creation', 'A New Event {#eventTitle#} has been posted, view the event details in Event Gallery page KORANGLE', 'A New Event {#eventTitle#} has been posted, view the event details in Event Gallery page'),
    SMSEventStructure.getStructure(14, 'Event Gallery Updation', 'The Event {#eventTitle#} has been updated/edited, view the event details in Event Gallery page KORANGLE', 'The Event {#eventTitle#} has been updated/edited, view the event details in Event Gallery page'),
    SMSEventStructure.getStructure(15, 'Event Gallery Deletion', 'The Event {#eventTitle#} has been removed from the event list KORANGLE', 'The Event {#eventTitle#} has been removed from the event list'),
];