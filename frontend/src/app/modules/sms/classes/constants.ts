import moment = require('moment');

export const COMMUNICATION_TYPE = ['SERVICE IMPLICIT', 'SERVICE EXPLICIT', 'TRANSACTIONAL'];
export const SENT_UPDATE_TYPE = [{id: 1, name: 'NULL'}, {id: 2, name: 'SMS'}, {id: 3, name: 'NOTIFICATION'}, {id: 4, name: 'NOTIF./SMS'}];

class VariableStructure {

    static getStructure(variable: any, backendKey: any, getValueFunc: any) {
        return {
            variable: variable,
            backendKey: backendKey,
            getValueFunc: getValueFunc,
        };
    }

}

export const COMMON_VARIABLES = [
    VariableStructure.getStructure('Date', 'date', () => {
        return moment(new Date()).format('DD/MM/YYYY');
    }),
    VariableStructure.getStructure('SchoolName', 'printName', (dataObject) => {
        return dataObject.school.printName;
    }),
    VariableStructure.getStructure('MobileNumber', 'mobileNumber', (dataObject) => {
        return dataObject.mobileNumber;
    })
];

export const STUDENT_VARIABLES = [
    COMMON_VARIABLES.concat(
        [
            VariableStructure.getStructure('StudentName', 'name', (dataObject) => {
                return dataObject.name;
            }),
            VariableStructure.getStructure('Class', 'class', (dataObject) => {
                return dataObject.class.name;
            }),
            VariableStructure.getStructure('Section', 'section', (dataObject) => {
                return dataObject.section.name;
            }),
            VariableStructure.getStructure('Class-Section', 'class-section', (dataObject) => {
                return dataObject.class.name + ', ' + dataObject.section.name;
            }),
            VariableStructure.getStructure('FathersName', 'fathersName', (dataObject) => {
                return dataObject.fathersName;
            }),
            VariableStructure.getStructure('StudentScholarId', 'scholarNumber', (dataObject) => {
                return dataObject.scholarNumber;
            }),

        ]
    )
];

export const EMPLOYEE_VARIABLES = [
    COMMON_VARIABLES.concat(
        [
            VariableStructure.getStructure('employeeName', 'name', (dataObject) => {
                return dataObject.name;
            })
        ]
    )
];

export const DEFAULTER_VARIABLES = [
    VariableStructure.getStructure('FeesDueTillMonth', 'feesDueTillMonth', (dataObject) => {
        return dataObject.feesDetails.feesDueTillMonth;
    }),
    VariableStructure.getStructure('FeesDueOverall', 'feesDueOverall', (dataObject) => {
        return dataObject.feesDetails.feesDueOverall;
    }),
];

export const ATTENDANCE_VARIABLES = [
    VariableStructure.getStructure('AttendanceStatus', 'attendanceStatus', (dataObject) => {
        return dataObject.attendanceDetails.attendanceStatus;
    }),
    VariableStructure.getStructure('attendanceDate', 'date', (dataObject) => {
        return moment(new Date(dataObject.attendanceDetails.date.toString())).format('DD/MM/YYYY');
    }),
];


export const HOMEWORK_VARIABLES = [
    VariableStructure.getStructure('HomeworkName', 'homeworkName', (dataObject) => {
        return dataObject.homeworkDetails.homeworkName;
    }),
    VariableStructure.getStructure('DeadLine', 'deadLine', (dataObject) => {
        return dataObject.homeworkDetails.deadLine;
    }),
];

export const TUTORIAL_VARIABLES = [
    VariableStructure.getStructure('TutorialChapter', 'tutorialChapter', (dataObject) => {
        return dataObject.tutorialDetails.tutorialChapter;
    }),
    VariableStructure.getStructure('TutorialTopic', 'tutorialTopic', (dataObject) => {
        return dataObject.tutorialDetails.tutorialTopic;
    }),
    VariableStructure.getStructure('Subject', 'subject', (dataObject) => {
        return dataObject.tutorialDetails.subject;
    }),
];

class SettingsPageStructure {

    static getStructure(pageName: any, eventsInOrder: any, VariableList: any) {
        return {
            name: pageName,
            orderedEvents: eventsInOrder,
            variableList: STUDENT_VARIABLES.concat(VariableList),
        };
    }

}


export const EVENT_SETTING_PAGES = [
    SettingsPageStructure.getStructure('General', [], []),
    SettingsPageStructure.getStructure('Notify Defaulters', [], DEFAULTER_VARIABLES),
    SettingsPageStructure.getStructure('Attendance', ['Attendance Creation', 'Attendance Updation'], ATTENDANCE_VARIABLES),
    SettingsPageStructure.getStructure('Homework', ['Homework Creation', 'Homework Updation', 'Homework Checked', 'Homework Resubmission', 'Homework Deletion'],
        HOMEWORK_VARIABLES),
    SettingsPageStructure.getStructure('Tutorial', ['Tutorial Creation', 'Tutorial Updation', 'Tutorial Deletion'], TUTORIAL_VARIABLES)
];

