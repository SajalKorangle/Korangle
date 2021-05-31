export const COMMUNICATION_TYPE = ['SERVICE IMPLICIT', 'SERVICE EXPLICIT', 'TRANSACTIONAL'];

export const EVENT_SETTING_PAGES = [
    {
        name: 'General',
        orderedEvents: [],
        variablesList: []
    },
    {
        name: 'Notify Defaulters',
        orderedEvents: [],
        variablesList: ['feesDueTillMonth', 'feesDueOverall']
    },
    {
        name: 'Attendance',
        orderedEvents: ['Attendance Creation', 'Attendance Updation'],
        variablesList: ['attendanceStatus', 'attendanceDate']
    },
    {
        name: 'Homework',
        orderedEvents: ['Homework Creation', 'Homework Updation', 'Homework Checked', 'Homework Resubmission', 'Homework Deletion'],
        variablesList: ['homeworkName', 'deadLine']
    },
    {
        name: 'Tutorial',
        orderedEvents: ['Tutorial Creation', 'Tutorial Updation', 'Tutorial Deletion'],
        variablesList: ['tutorialChapter', 'tutorialTopic', 'subject'],
    }
];


export const COMMON_VARIABLES = ['date', 'schoolName', 'mobileNumber'];
export const STUDENT_VARIABLES = ['studentName', 'class', 'fathersName', 'studentScholarNumber'];
export const EMPLOYEE_VARIABLES = ['employeeName'];

export const SENT_UPDATE_TYPE = [{id: 1, name: 'NULL'}, {id: 2, name: 'SMS'}, {id: 3, name: 'NOTIFICATION'}, {id: 4, name: 'NOTIF./SMS'}];

