import moment = require('moment');

export const NEW_LINE_REGEX = /(\r)?\n/g;
export const FIND_VARIABLE_REGEX = /{#(.*?)#}/g;

class VariableStructure {

    static getStructure(displayVariableName: any, childBackendKeyOrFunc: any, parentObject: any = null) {
        let getValFunc = childBackendKeyOrFunc;
        if (typeof childBackendKeyOrFunc !== 'function') {
            getValFunc = (dataObject) => {
                return dataObject[parentObject][childBackendKeyOrFunc];
            };
        }
        return {
            displayVariable: displayVariableName,
            getValueFunc: getValFunc,
        };
    }
}

class StudentVariableStructure {
    static getStructure(displayVariable: any, backendKeyOrFunc: any) {
        return VariableStructure.getStructure(
            displayVariable,
            backendKeyOrFunc,
            'student',
        );
    }
}

class EmployeeVariableStructure {
    static getStructure(displayVariable: any, backendKeyOrFunc: any) {
        return VariableStructure.getStructure(
            displayVariable,
            backendKeyOrFunc,
            'employee',
        );
    }
}

class CommonPersonVariableStructure {
    static getStructure(displayVariable: any, backendKeyOrFunc: any) {
        return VariableStructure.getStructure(
            displayVariable,
            backendKeyOrFunc,
            'commonPerson'
        );
    }
}

class SettingsStructure {
    static getStructure(displayVariable: any, modelName: any, backendKeyOrFunc: any) {
        return VariableStructure.getStructure(
            displayVariable,
            backendKeyOrFunc,
            modelName,
        );
    }
}

export const COMMON_VARIABLE_LIST = [
    VariableStructure.getStructure('date', (objectData) => {
        return moment(new Date()).format('DD/MM/YYYY');
    }),
    VariableStructure.getStructure('schoolName', (objectData) => {
        return objectData.school.printName;
    }),
];

export const STUDENT_VARIABLE_LIST = [
    StudentVariableStructure.getStructure('studentName', 'name'),
    StudentVariableStructure.getStructure('classSection', (dataObject) => {
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
    StudentVariableStructure.getStructure('class', (dataObject) => {
        return dataObject.classList.find(
            classs => {
                return classs.id === dataObject.studentSectionList.find(
                    x => x.parentStudent === dataObject.student.id
                ).parentClass;
            }
        ).name;
    }),
    StudentVariableStructure.getStructure('section', (dataObject) => {
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


export const COMMON_PERSON_VARIABLE_LIST = [
    CommonPersonVariableStructure.getStructure('name', 'name'),
    CommonPersonVariableStructure.getStructure('mobileNumber', 'mobileNumber'),
    CommonPersonVariableStructure.getStructure('fathersName', 'fathersName')
];


export const DEFAULTER_VARIABLE_LIST = [
    SettingsStructure.getStructure('feesDueTillMonth', 'fee', (dataObject) => {
        return 'Rs. ' + Number(dataObject['student'].feesDueTillMonth).toLocaleString('en-IN');
    }),
    SettingsStructure.getStructure('feesDueOverall', 'fee', (dataObject) => {
        return 'Rs. ' + Number(dataObject['student'].feesDueOverall).toLocaleString('en-IN');
    })
];

export const ATTENDANCE_VARIABLE_LIST = [
    SettingsStructure.getStructure('attendanceStatus', 'attendance', (dataObject) => {
        return dataObject['student'].attendance.attendanceStatus;
    }),
    SettingsStructure.getStructure('attendanceDate', 'attendance', (dataObject) => {
        return dataObject['student'].attendance.attendanceDate;
    })
];


export const HOMEWORK_VARIABLE_LIST = [
    SettingsStructure.getStructure('homeworkName', 'homework', 'homeworkName'),
    SettingsStructure.getStructure('deadLine', 'homework', (dataObject) => {
        if (dataObject.homework.endDate) {
            return dataObject.homework.endDate + ' , ' + dataObject.homework.endTime;
        } else {
            return 'Deadline not mentioned';
        }
    }),
    SettingsStructure.getStructure('subject', 'homework', (dataObject) => {
        return dataObject.subjectList.find(sub =>
            sub.id == dataObject.classSubjectList.find(
                classSub => classSub.id == dataObject.homework.parentClassSubject)
                .parentSubject).name;
    })
];

export const TUTORIAL_VARIABLE_LIST = [
    SettingsStructure.getStructure('tutorialChapter', 'tutorial', 'chapter'),
    SettingsStructure.getStructure('tutorialTopic', 'tutorial', 'topic'),
    SettingsStructure.getStructure('subject', 'tutorial', (dataObject) => {
        return dataObject.subjectList.find(sub =>
            sub.id == dataObject.classSubjectList.find(
                classSub => classSub.id == dataObject.tutorial.parentClassSubject)
                .parentSubject).name;
    })
];

export const EVENT_GALLERY_VARIABLE_LIST = [
    SettingsStructure.getStructure('eventTitle', 'event', 'title'),
    SettingsStructure.getStructure('eventHeldOn', 'event', (dataObject) => {
        return moment(new Date(dataObject.event.heldOn)).format('DD/MM/YYYY');
    })
];

export const DISCOUNT_VARIABLE_LIST = [
    SettingsStructure.getStructure('discountAmount', 'discountAmount', (dataObject) => {
        return Number(dataObject['student'].discountAmount).toLocaleString('en-IN');
    }),
    SettingsStructure.getStructure('session', 'session', (dataObject) => {
        return dataObject['student'].session.name;
    })
];  // Creating a variable list so that discountAmount, session variables can be accessed while parsing the SMS template content

export const FEE_RECEIPT_VARIABLE_LIST = [
    SettingsStructure.getStructure('feeAmount', 'feeAmount', (dataObject) => {
        return Number(dataObject['student'].feeAmount).toLocaleString('en-IN');
    }),
    SettingsStructure.getStructure('dueFeeAmount', 'dueFeeAmount', (dataObject) => {
        return Number(dataObject['student'].dueFeeAmount).toLocaleString('en-IN');
    }),
    SettingsStructure.getStructure('session', 'session', (dataObject) => {
        return dataObject['student'].session.name;
    }),
    SettingsStructure.getStructure('feeReceiptNumber', 'feeReceiptNumber', (dataObject) => {
        return dataObject['student'].feeReceiptBook.receiptNumberPrefix + dataObject['student'].feeReceipt.receiptNumber;
    })

];  // Creating a variable list so that feeAmount, dueFeeAmount and session variables can be accessed while parsing the SMS template content


class MappingEventWithVariableStructure {
    static getStructure(SMSEventId, variableList) {
        return {
            eventId: SMSEventId,
            variableList: COMMON_VARIABLE_LIST.concat(variableList),
        };
    }
}

export const VARIABLE_MAPPED_EVENT_LIST = [
    MappingEventWithVariableStructure.getStructure(1, STUDENT_VARIABLE_LIST), // Student General SMS
    MappingEventWithVariableStructure.getStructure(2, EMPLOYEE_VARIABLE_LIST), // Employee General SMS
    MappingEventWithVariableStructure.getStructure(3, COMMON_PERSON_VARIABLE_LIST), // Common General SMS
    MappingEventWithVariableStructure.getStructure(4, STUDENT_VARIABLE_LIST.concat(DEFAULTER_VARIABLE_LIST)), // Notify Defaulters
    MappingEventWithVariableStructure.getStructure(5, STUDENT_VARIABLE_LIST.concat(ATTENDANCE_VARIABLE_LIST)), // Attendance Creation
    MappingEventWithVariableStructure.getStructure(6, STUDENT_VARIABLE_LIST.concat(ATTENDANCE_VARIABLE_LIST)), // Attendance Updation
    MappingEventWithVariableStructure.getStructure(7, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)), // Homework Creation
    MappingEventWithVariableStructure.getStructure(8, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)), // Homework Updation
    MappingEventWithVariableStructure.getStructure(9, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)), // Homework Deletion
    MappingEventWithVariableStructure.getStructure(10, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)), // Homework Checked
    MappingEventWithVariableStructure.getStructure(11, STUDENT_VARIABLE_LIST.concat(HOMEWORK_VARIABLE_LIST)), // Homework Resubmission
    MappingEventWithVariableStructure.getStructure(12, STUDENT_VARIABLE_LIST.concat(TUTORIAL_VARIABLE_LIST)), // Tutorial Creation
    MappingEventWithVariableStructure.getStructure(13, STUDENT_VARIABLE_LIST.concat(TUTORIAL_VARIABLE_LIST)), // Tutorial Updation
    MappingEventWithVariableStructure.getStructure(14, STUDENT_VARIABLE_LIST.concat(TUTORIAL_VARIABLE_LIST)), // Tutorial Deletion
    MappingEventWithVariableStructure.getStructure(15, COMMON_PERSON_VARIABLE_LIST.concat(EVENT_GALLERY_VARIABLE_LIST)), // Event Gallery Creation
    MappingEventWithVariableStructure.getStructure(16, COMMON_PERSON_VARIABLE_LIST.concat(EVENT_GALLERY_VARIABLE_LIST)), // Event Gallery Updation
    MappingEventWithVariableStructure.getStructure(17, COMMON_PERSON_VARIABLE_LIST.concat(EVENT_GALLERY_VARIABLE_LIST)), // Event Gallery Deletion
    MappingEventWithVariableStructure.getStructure(18, STUDENT_VARIABLE_LIST.concat(DISCOUNT_VARIABLE_LIST)), // Discount Details Notification
    MappingEventWithVariableStructure.getStructure(19, STUDENT_VARIABLE_LIST.concat(FEE_RECEIPT_VARIABLE_LIST)) // Fee Receipt Notification
];