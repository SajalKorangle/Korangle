class SMSEventStructure {

    static getStructure(id: number, eventName: string, defaultSMSTemplateDbId: number, defaultNotificationContent: string) {
        return {
            id: id,
            eventName: eventName,
            defaultSMSTemplateDbId: defaultSMSTemplateDbId,
            defaultNotificationContent: defaultNotificationContent,
        };
    }
}


export const SMS_EVENT_LIST = [
    SMSEventStructure.getStructure(1, 'Student General SMS', null, ''),
    SMSEventStructure.getStructure(2, 'Employee General SMS', null, ''),
    SMSEventStructure.getStructure(3, 'Common General SMS', null, ''),
    SMSEventStructure.getStructure(4, 'Notify Defaulters', null, ''),
    SMSEventStructure.getStructure(5, 'Attendance Creation', 1, 'Your ward, {#studentName#} is marked {#attendanceStatus#} on {#attendanceDate#}'),
    SMSEventStructure.getStructure(6, 'Attendance Updation', 2, 'Your ward\'s attendance has been corrected to {#attendanceStatus#} korngl'),
    SMSEventStructure.getStructure(7, 'Homework Creation', 3, 'New Homework is added in {#subject#},Title -\n \'{#homeworkName#}\' Last date to submit -\n {#deadLine#}'),
    SMSEventStructure.getStructure(8, 'Homework Updation', 4, 'Please note, there are changes in the Homework \'{#homeworkName#}\' of {#subject#}\''),
    SMSEventStructure.getStructure(9, 'Homework Deletion', 5, 'Please note, the homework \'{#homeworkName#}\' of subject {#subject#} has been removed'),
    SMSEventStructure.getStructure(10, 'Homework Checked', 6, 'Your Homework {#homeworkName#} of Subject {#subject#} has been checked'),
    SMSEventStructure.getStructure(11, 'Homework Resubmission', 7, 'Your Homework {#homeworkName#} of Subject {#subject#} has been asked for resubmission'),
    SMSEventStructure.getStructure(12, 'Tutorial Creation', 8, 'A new tutorial has been created in the Subject {#subject#};'),
    SMSEventStructure.getStructure(13, 'Tutorial Updation', 9, 'The following tutorial has been edited -\n Topic {#tutorialTopic#}; Subject {#subject#}; Chapter {#tutorialChapter#}'),
    SMSEventStructure.getStructure(14, 'Tutorial Deletion', 10, 'The following tutorial has been deleted -\n Topic {#tutorialTopic#};'),
    SMSEventStructure.getStructure(15, 'Event Gallery Creation', 11,
        'A New Event {#eventTitle#} has been posted, view the event details in Event Gallery page'),
    SMSEventStructure.getStructure(16, 'Event Gallery Updation', 12, 'The Event {#eventTitle#} has been updated/edited, view the event details in Event Gallery page'),
    SMSEventStructure.getStructure(17, 'Event Gallery Deletion', 13, 'The Event {#eventTitle#} has been removed from the event list')
];