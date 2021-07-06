import moment = require('moment');

export const NEW_LINE_REGEX = /(\r)?\n/g;
export const FIND_VARIABLE_REGEX = /{#(.*?)#}/g;

class VariableStructure {

    static getStructure(displayVariableName: any, getValueFunc: any) {
        return {
            displayVariable: displayVariableName,
            getValueFunc: getValueFunc,
        };
    }
}

class StudentVariableStructure {
    static getStructure(displayVariable: any, backendKey: any, getValFunc: any = (dataObject) => {
        return dataObject['student'][backendKey];
    }) {
        return VariableStructure.getStructure(
            displayVariable,
            getValFunc,
        );
    }
}

class EmployeeVariableStructure {
    static getStructure(displayVariable: any, backendKey: any, getValFunc: any = (dataObject) => {
        return dataObject['employee'][backendKey];
    }) {
        return VariableStructure.getStructure(
            displayVariable,
            getValFunc,
        );
    }
}

class EmployeeAndStudentStructure {
    static getStructure(displayVariable: any, backendKey: any, getValFunc: any = (dataObject) => {
        return dataObject[dataObject['person']][backendKey];
    }) {
        return VariableStructure.getStructure(
            displayVariable,
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
            func,
        );
    }
}

export const COMMON_VARIABLE_LIST = [
    VariableStructure.getStructure('date',  (objectData) => {
        return moment(new Date()).format('DD/MM/YYYY');
    }),
    VariableStructure.getStructure('schoolName', (objectData) => {
        return objectData.school.printName;
    }),
];

export const STUDENT_VARIABLE_LIST = [
    StudentVariableStructure.getStructure('studentName', 'name'),
    StudentVariableStructure.getStructure('classSection', 'classSection', (dataObject) => {
        return dataObject.classList.find(
            classs => {
                return classs.id === dataObject.studentSectionList.find(
                    x => x.parentStudent === dataObject.student.id
                ).parentClass;
            }
            ).name
            + ', '
            + dataObject.divisionList.find(
                division => {
                    return division.id === dataObject.studentSectionList.find(
                        x => x.parentStudent === dataObject.student.id
                    ).parentDivision;
                }
            ).name;
    }),
    StudentVariableStructure.getStructure('class', 'class', (dataObject) => {
        return dataObject.classList.find(
            classs => {
                return classs.id === dataObject.studentSectionList.find(
                    x => x.parentStudent === dataObject.student.id
                ).parentClass;
            }
        ).name;
    }),
    StudentVariableStructure.getStructure('section', 'section', (dataObject) => {
        return dataObject.divisionList.find(
            division => {
                return division.id === dataObject.studentSectionList.find(
                    x => x.parentStudent === dataObject.student.id
                ).parentDivision;
            }
        ).name;
    }),
    StudentVariableStructure.getStructure('fathersName', 'fathersName'),
    StudentVariableStructure.getStructure('studentScholarId', 'scholarNumber'),
    StudentVariableStructure.getStructure('mobileNumber', 'mobileNumber'),
];

export const EMPLOYEE_VARIABLE_LIST = [
    EmployeeVariableStructure.getStructure('employeeName', 'name'),
    EmployeeVariableStructure.getStructure('mobileNumber', 'mobileNumber'),
];


export const STUDENT_AND_EMPLOYEE_VARIABLE_LIST = [
     EmployeeAndStudentStructure.getStructure('name', 'name'),
     EmployeeAndStudentStructure.getStructure('mobileNumber', 'mobileNumber'),
     EmployeeAndStudentStructure.getStructure('fathersName', 'fathersName')
];


export const DEFAULTER_VARIABLE_LIST = [
    SettingsStructure.getStructure('feesDueTillMonth', 'fee', 'feesDueTillMonth', (dataObject) => {
        return 'Rs. ' + Number(dataObject['student'].feesDueTillMonth).toLocaleString('en-IN');
    }),
    SettingsStructure.getStructure('feesDueOverall', 'fee', 'feesDueOverall', (dataObject) => {
        return 'Rs. ' + Number(dataObject['student'].feesDueOverall).toLocaleString('en-IN');
    })
];

export const ATTENDANCE_VARIABLE_LIST = [
    SettingsStructure.getStructure('attendanceStatus', 'attendance', 'attendanceStatus', (dataObject) => {
        return dataObject['student'].attendance.attendanceStatus;
    }),
    SettingsStructure.getStructure('attendanceDate', 'attendance', 'attendanceDate', (dataObject) => {
        return dataObject['student'].attendance.attendanceDate;
    })
];


export const HOMEWORK_VARIABLE_LIST = [
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
];

export const TUTORIAL_VARIABLE_LIST = [
    SettingsStructure.getStructure('tutorialChapter', 'tutorial', 'chapter'),
    SettingsStructure.getStructure('tutorialTopic', 'tutorial', 'topic'),
    SettingsStructure.getStructure('subject', 'tutorial', 'subject', (dataObject) => {
        return dataObject.subjectList.find(sub =>
            sub.id == dataObject.classSubjectList.find(
            classSub => classSub.id == dataObject.tutorial.parentClassSubject)
                .parentSubject).name;
    })
];

export const EVENT_GALLERY_VARIABLE_LIST = [
    SettingsStructure.getStructure('eventTitle', 'event', 'title'),
    SettingsStructure.getStructure('eventHeldOn', 'event', 'heldOn', (dataObject) => {
        return moment(new Date(dataObject.event.heldOn)).format('DD/MM/YYYY');
    })
];


class MappingEventWithVariableStructure{
    static getStructure(SMSEventId, variableList) {
        return {
            event: SMS_EVENT_LIST.find(e => e.id == SMSEventId),
            variableList: COMMON_VARIABLE_LIST.concat(variableList),
        };
    }
}

export const VARIABLE_MAPPED_EVENT_LIST = [
    MappingEventWithVariableStructure.getStructure(1, STUDENT_VARIABLE_LIST),
    MappingEventWithVariableStructure.getStructure(2, EMPLOYEE_VARIABLE_LIST),
    MappingEventWithVariableStructure.getStructure(3, STUDENT_AND_EMPLOYEE_VARIABLE_LIST),
    MappingEventWithVariableStructure.getStructure(4, STUDENT_VARIABLE_LIST.concat(DEFAULTER_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(5, STUDENT_VARIABLE_LIST.concat(ATTENDANCE_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(6, STUDENT_VARIABLE_LIST.concat(ATTENDANCE_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(7, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(8, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(9, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(10, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(11, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(12, STUDENT_VARIABLE_LIST.concat(TUTORIAL_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(13, STUDENT_VARIABLE_LIST.concat(TUTORIAL_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(14, STUDENT_VARIABLE_LIST.concat(TUTORIAL_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(15, STUDENT_AND_EMPLOYEE_VARIABLE_LIST.concat(EVENT_GALLERY_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(16, STUDENT_AND_EMPLOYEE_VARIABLE_LIST.concat(EVENT_GALLERY_VARIABLE_LIST)),
    MappingEventWithVariableStructure.getStructure(17, STUDENT_AND_EMPLOYEE_VARIABLE_LIST.concat(EVENT_GALLERY_VARIABLE_LIST))
];