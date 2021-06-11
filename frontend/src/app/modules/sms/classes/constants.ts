import moment = require('moment');

export const NEW_LINE_REGEX = /(\\r)?\\n/g;
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

class StudentVariableStructure {
    static getStructure(displayVariable: any, backendKey: any, getValFunc: any = (dataObject) => {
        return dataObject['studentList'].find(stud => stud.id == dataObject['studentId'])[backendKey];
    }) {
        return VariableStructure.getStructure(
            displayVariable,
            backendKey,
            getValFunc,
        );
    }
}

class EmployeeVariableStructure {
    static getStructure(displayVariable: any, backendKey: any, getValFunc: any = (dataObject) => {
        return dataObject['employeeList'].find(stud => stud.id == dataObject['employeeId'])[backendKey];
    }) {
        return VariableStructure.getStructure(
            displayVariable,
            backendKey,
            getValFunc,
        );
    }
}


class SettingsStructure {
    static getStructure(displayVariable: any, modelName: any, backendKey: any, func = (dataObject) => {
        return dataObject[modelName][backendKey];
    }) {
        return VariableStructure.getStructure(
            displayVariable,
            backendKey,
            func,
        );
    }
}

export const COMMON_VARIABLES = [
    VariableStructure.getStructure('date', 'date', (objectData) => {
        return moment(new Date()).format('DD/MM/YYYY');
    }),
    VariableStructure.getStructure('schoolName', 'printName', (objectData) => {
        return objectData.school.printName;
    }),
];


export const STUDENT_VARIABLES = COMMON_VARIABLES.concat(
    [
        StudentVariableStructure.getStructure('studentName', 'name'),
        StudentVariableStructure.getStructure('classSection', 'classSection', (dataObject) => {
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
        StudentVariableStructure.getStructure('class', 'class', (dataObject) => {
            return dataObject.classList.find(
                classs => {
                    return classs.id === dataObject.studentSectionList.find(
                        x => x.parentStudent === dataObject.studentId
                    ).parentClass;
                }
            ).name;
        }),
        StudentVariableStructure.getStructure('section', 'section', (dataObject) => {
            return dataObject.divisionList.find(
                division => {
                    return division.id === dataObject.studentSectionList.find(
                        x => x.parentStudent === dataObject.studentId
                    ).parentDivision;
                }
            ).name;
        }),
        StudentVariableStructure.getStructure('fathersName', 'fathersName'),
        StudentVariableStructure.getStructure('studentScholarId', 'scholarNumber'),
        StudentVariableStructure.getStructure('mobileNumber', 'mobileNumber'),
    ]
);

export const EMPLOYEE_VARIABLES = COMMON_VARIABLES.concat([
    EmployeeVariableStructure.getStructure('employeeName', 'name'),
    EmployeeVariableStructure.getStructure('mobileNumber', 'mobileNumber'),
]);

export const DEFAULTER_VARIABLES = STUDENT_VARIABLES.concat([
    SettingsStructure.getStructure('feesDueTillMonth', 'fee', 'feesDueTillMonth', (dataObject) => {
        return dataObject['studentList'].find(stud => stud.id == dataObject['studentId']).feesDueTillMonth;
    }),
    SettingsStructure.getStructure('feesDueOverall', 'fee', 'feesDueOverall', (dataObject) => {
        return dataObject['studentList'].find(stud => stud.id == dataObject['studentId']).feesDueOverall;
    })
]);

export const ATTENDANCE_VARIABLES = STUDENT_VARIABLES.concat([
    SettingsStructure.getStructure('attendanceStatus', 'attendance', 'attendanceStatus', (dataObject) => {
        return dataObject['studentList'].find(stud => stud.id == dataObject['studentId']).attendance.attendanceStatus;
    }),
    SettingsStructure.getStructure('attendanceDate', 'attendance', 'attendanceDate', (dataObject) => {
        return dataObject['studentList'].find(stud => stud.id == dataObject['studentId']).attendance.attendanceDate;
    })
]);


export const HOMEWORK_VARIABLES = STUDENT_VARIABLES.concat([
    SettingsStructure.getStructure('homeworkName', 'homework', 'homeworkName'),
    SettingsStructure.getStructure('deadLine', 'homework', 'deadLine', (dataObject) => {
        if (dataObject.homework.endDate) {
            return dataObject.homework.endDate + ' , ' + dataObject.homework.endTime;
        } else {
            return 'Deadline not mentioned';
        }
    }),
    SettingsStructure.getStructure('subject', 'homework', 'subject', (dataObject) => {
        return dataObject.subjectList.find(sub =>
            sub.id == dataObject.classSubjectList.find(
            classSub => classSub.id == dataObject.homework.parentClassSubject)
                .parentSubject).name;
    })
]);

export const TUTORIAL_VARIABLES = STUDENT_VARIABLES.concat([
    SettingsStructure.getStructure('tutorialChapter', 'tutorial', 'chapter'),
    SettingsStructure.getStructure('tutorialTopic', 'tutorial', 'topic'),
    SettingsStructure.getStructure('subject', 'tutorial', 'subject', (dataObject) => {
        return dataObject.subjectList.find(sub =>
            sub.id == dataObject.classSubjectList.find(
            classSub => classSub.id == dataObject.tutorial.parentClassSubject)
                .parentSubject).name;
    })
]);

export const EVENT_GALLERY_VARIABLES = COMMON_VARIABLES.concat([
    SettingsStructure.getStructure('eventTitle', 'event', 'title'),
    SettingsStructure.getStructure('eventHeldOn', 'event', 'heldOn', (dataObject) => {
        return moment(new Date(dataObject.event.heldOn)).format('DD/MM/YYYY');
    })
]);


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
        TUTORIAL_VARIABLES),
    SettingsPageStructure.getStructure('Event Gallery',
        ['Event Gallery Creation', 'Event Gallery Updation', 'Event Gallery Deletion'],
        EVENT_GALLERY_VARIABLES)
];
