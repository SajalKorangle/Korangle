import moment = require('moment');

export const COMMUNICATION_TYPE = ['SERVICE IMPLICIT', 'SERVICE EXPLICIT', 'TRANSACTIONAL'];
export const SENT_UPDATE_TYPE = [{id: 1, name: 'NULL'}, {id: 2, name: 'SMS'}, {id: 3, name: 'NOTIFICATION'}, {id: 4, name: 'NOTIF./SMS'}];

class VariableStructure {

    static getStructure(displayVariableName: any, backendKey: any, getValueFunc: any) {
        return {
            displayVariable: displayVariableName,
            backendKey: backendKey,
            getValueFunc: getValueFunc,
        };
    }
}

class StudentOrEmployeeVariableStructure {
    static getStructure(displayVariable: any, person: any, backendKey: any, getValFunc: any = (dataObject) => {
        return dataObject[person + 'List'].find(stud => stud.id == dataObject[person + 'Id'])[backendKey];
    }) {
        return VariableStructure.getStructure(
            displayVariable,
            backendKey,
            getValFunc,
        );
    }
}


class SettingsStructure {
    static getStructure(displayVariable: any, modelName: any, backendKey: any) {
        let func = (dataObject) => {
            return dataObject[modelName][backendKey];
        };
        if (backendKey == 'subject') {
            func = (dataObject) => {
                return dataObject.subjectList.find(sub =>
                    sub.id == dataObject.classSubjectList.find(
                    classSub => classSub.id == dataObject[modelName].parentClassSubject)
                        .parentSubject).name;
            };
        }
        if (modelName == 'attendance') {
            return StudentOrEmployeeVariableStructure.getStructure(displayVariable, 'student', backendKey);
        }
        return VariableStructure.getStructure(
            displayVariable,
            backendKey,
            func,
        );
    }
}

export const COMMON_VARIABLES = [
    VariableStructure.getStructure('Date', 'date', (objectData) => {
        return moment(new Date()).format('DD/MM/YYYY');
    }),
    VariableStructure.getStructure('SchoolName', 'printName', (objectData) => {
        return objectData.school.printName;
    }),
];


export const STUDENT_VARIABLES = COMMON_VARIABLES.concat(
    [
        StudentOrEmployeeVariableStructure.getStructure('StudentName', 'student', 'name'),
        StudentOrEmployeeVariableStructure.getStructure('Class', 'student', 'class', (dataObject) => {
            return dataObject.classList.find(
                classs => {
                    return classs.id === dataObject.studentSectionList.find(
                        x => x.parentStudent === dataObject.studentId
                    ).parentClass;
                }
            ).name;
        }),
        StudentOrEmployeeVariableStructure.getStructure('Section', 'student', 'section', (dataObject) => {
            return dataObject.divisionList.find(
                division => {
                    return division.id === dataObject.studentSectionList.find(
                        x => x.parentStudent === dataObject.studentId
                    ).parentDivision;
                }
            ).name;
        }),
        StudentOrEmployeeVariableStructure.getStructure('Class-Section', 'student', 'class-section', (dataObject) => {
            return dataObject.classList.find(
                classs => {
                    return classs.id === dataObject.studentSectionList.find(
                        x => x.parentStudent === dataObject.studentId
                    ).parentClass;
                }
                ).name
                + ', '
                + dataObject.divisionList.find(
                    division => {
                        return division.id === dataObject.studentSectionList.find(
                            x => x.parentStudent === dataObject.studentId
                        ).parentDivision;
                    }
                ).name;
        }),
        StudentOrEmployeeVariableStructure.getStructure('FathersName', 'student', 'fathersName'),
        StudentOrEmployeeVariableStructure.getStructure('StudentScholarId', 'student', 'scholarNumber'),
        StudentOrEmployeeVariableStructure.getStructure('MobileNumber', 'student', 'mobileNumber'),
    ]
);

export const EMPLOYEE_VARIABLES = COMMON_VARIABLES.concat(
    [
        StudentOrEmployeeVariableStructure.getStructure('EmployeeName', 'employee', 'name'),
        StudentOrEmployeeVariableStructure.getStructure('MobileNumber', 'employee', 'mobileNumber'),
    ]
);

export const DEFAULTER_VARIABLES = STUDENT_VARIABLES.concat([SettingsStructure.getStructure('FeesDueTillMonth', 'fee', 'feesDueTillMonth'),
    SettingsStructure.getStructure('FeesDueOverall', 'fee', 'feesDueOverall')]);

export const ATTENDANCE_VARIABLES = STUDENT_VARIABLES.concat([SettingsStructure.getStructure('AttendanceStatus', 'attendance', 'attendanceStatus'),
    SettingsStructure.getStructure('AttendanceDate', 'attendance', 'date')]);


export const HOMEWORK_VARIABLES = STUDENT_VARIABLES.concat([SettingsStructure.getStructure('HomeworkName', 'homework', 'homeworkName'),
    SettingsStructure.getStructure('DeadLine', 'homework', 'deadLine'),
    SettingsStructure.getStructure('Subject', 'homework', 'subject')]);

export const TUTORIAL_VARIABLES = STUDENT_VARIABLES.concat([SettingsStructure.getStructure('TutorialChapter', 'tutorial', 'tutorialChapter'),
    SettingsStructure.getStructure('TutorialTopic', 'tutorial', 'tutorialTopic'),
    SettingsStructure.getStructure('Subject', 'tutorial', 'subject')]);

class SettingsPageStructure {
    static getStructure(pageName: any, eventsInOrder: any, VariableList: any) {
        return {
            name: pageName,
            orderedEvents: eventsInOrder,
            variableList: VariableList,
        };
    }
}


export const EVENT_SETTING_PAGES = [
    SettingsPageStructure.getStructure('General', [], []),
    SettingsPageStructure.getStructure('Notify Defaulters', [], DEFAULTER_VARIABLES),
    SettingsPageStructure.getStructure('Attendance',
        ['Attendance Creation', 'Attendance Updation'],
        ATTENDANCE_VARIABLES),
    SettingsPageStructure.getStructure('Homework',
        ['Homework Creation', 'Homework Updation', 'Homework Checked', 'Homework Resubmission', 'Homework Deletion'],
        HOMEWORK_VARIABLES),
    SettingsPageStructure.getStructure('Tutorial',
        ['Tutorial Creation', 'Tutorial Updation', 'Tutorial Deletion'],
        TUTORIAL_VARIABLES)
];

