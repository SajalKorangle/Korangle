// Note: The fieldStructureKey values will be saved in database
// so you can not change fieldStructureKey values at a later stage.

class FieldStructure {
    static getStructure(displayFieldName: any, fieldStructureKey: any): any {
        return {
            displayFieldName: displayFieldName,
            fieldStructureKey: fieldStructureKey,
        };
    }
}

export const FIELDS = {
    STUDENT: FieldStructure.getStructure('Student', 'student'),
    STUDENT_SESSION: FieldStructure.getStructure('Student Session', 'student_session'),
    STUDENT_CUSTOM: FieldStructure.getStructure('Student Custom', 'student_custom'),
    SCHOOL: FieldStructure.getStructure('School', 'school'),
    CONSTANT: FieldStructure.getStructure('Constant', 'constant'),
};

export const DATA_TYPES = {
    TEXT: 'text',
    DATE: 'date',
    IMAGE: 'image',
};

function getNumberInWords(numerical: number): string {
    switch (numerical) {
        case 1:
            return 'One';
        case 2:
            return 'Two';
        case 3:
            return 'Three';
        case 4:
            return 'Four';
        case 5:
            return 'Five';
        case 6:
            return 'Six';
        case 7:
            return 'Seven';
        case 8:
            return 'Eight';
        case 9:
            return 'Nine';
        case 10:
            return 'Ten';
        case 11:
            return 'Eleven';
        case 12:
            return 'Twelve';
        case 13:
            return 'Thirteen';
        case 14:
            return 'Fourteen';
        case 15:
            return 'Fifteen';
        case 16:
            return 'Sixteen';
        case 17:
            return 'Seventeen';
        case 18:
            return 'Eighteen';
        case 19:
            return 'Nineteen';
        case 20:
            return 'Twenty';
        case 21:
            return 'Twenty One';
        case 22:
            return 'Twenty Two';
        case 23:
            return 'Twenty Three';
        case 24:
            return 'Twenty Four';
        case 25:
            return 'Twenty Five';
        case 26:
            return 'Twenty Six';
        case 27:
            return 'Twenty Seven';
        case 28:
            return 'Twenty Eight';
        case 29:
            return 'Twenty Nine';
        case 30:
            return 'Thirty';
        case 31:
            return 'Thirty One';
        case 32:
            return 'Thirty Two';
        case 33:
            return 'Thirty Three';
        case 34:
            return 'Thirty Four';
        case 35:
            return 'Thirty Five';
        case 36:
            return 'Thirty Six';
        case 37:
            return 'Thirty Seven';
        case 38:
            return 'Thirty Eight';
        case 39:
            return 'Thirty Nine';
        case 40:
            return 'Forty';
        case 41:
            return 'Forty One';
        case 42:
            return 'Forty Two';
        case 43:
            return 'Forty Three';
        case 44:
            return 'Forty Four';
        case 45:
            return 'Forty Five';
        case 46:
            return 'Forty Six';
        case 47:
            return 'Forty Seven';
        case 48:
            return 'Forty Eight';
        case 49:
            return 'Forty Nine';
        case 50:
            return 'Fifty';
        case 51:
            return 'Fifty One';
        case 52:
            return 'Fifty Two';
        case 53:
            return 'Fifty Three';
        case 54:
            return 'Fifty Four';
        case 55:
            return 'Fifty Five';
        case 56:
            return 'Fifty Six';
        case 57:
            return 'Fifty Seven';
        case 58:
            return 'Fifty Eight';
        case 59:
            return 'Fifty Nine';
        case 60:
            return 'Sixty';
        case 61:
            return 'Sixty One';
        case 62:
            return 'Sixty Two';
        case 63:
            return 'Sixty Three';
        case 64:
            return 'Sixty Four';
        case 65:
            return 'Sixty Five';
        case 66:
            return 'Sixty Six';
        case 67:
            return 'Sixty Seven';
        case 68:
            return 'Sixty Eight';
        case 69:
            return 'Sixty Nine';
        case 70:
            return 'Seventy';
        case 71:
            return 'Seventy One';
        case 72:
            return 'Seventy Two';
        case 73:
            return 'Seventy Three';
        case 74:
            return 'Seventy Four';
        case 75:
            return 'Seventy Five';
        case 76:
            return 'Seventy Six';
        case 77:
            return 'Seventy Seven';
        case 78:
            return 'Seventy Eight';
        case 79:
            return 'Seventy Nine';
        case 80:
            return 'Eighty';
        case 81:
            return 'Eighty One';
        case 82:
            return 'Eighty Two';
        case 83:
            return 'Eighty Three';
        case 84:
            return 'Eighty Four';
        case 85:
            return 'Eighty Five';
        case 86:
            return 'Eighty Six';
        case 87:
            return 'Eighty Seven';
        case 88:
            return 'Eighty Eight';
        case 89:
            return 'Eighty Nine';
        case 90:
            return 'Ninety';
        case 91:
            return 'Ninety One';
        case 92:
            return 'Ninety Two';
        case 93:
            return 'Ninety Three';
        case 94:
            return 'Ninety Four';
        case 95:
            return 'Ninety Five';
        case 96:
            return 'Ninety Six';
        case 97:
            return 'Ninety Seven';
        case 98:
            return 'Ninety Eight';
        case 99:
            return 'Ninety Nine';
        default:
            return '';
    }
}

function getYear(year: any): string {
    if (year < 2000) {
        return getNumberInWords(Math.floor(year / 100)) + ' ' + getNumberInWords(year % 100);
    } else {
        return 'Two Thousand ' + getNumberInWords(year % 100);
    }
}

function getDateReplacements(date: any): any {
    // Calculating dddValue
    const s = ['th', 'st', 'nd', 'rd'];
    const v = date.getDate() % 100;
    const dddValue = date.getDate() + (s[(v - 20) % 10] || s[v] || s[0]);

    // Calculating ddddValue
    let ddddValue;
    switch (date.getDate()) {
        case 1:
            ddddValue = 'First';
            break;
        case 2:
            ddddValue = 'Second';
            break;
        case 3:
            ddddValue = 'Third';
            break;
        case 4:
            ddddValue = 'Fourth';
            break;
        case 5:
            ddddValue = 'Fifth';
            break;
        case 6:
            ddddValue = 'Sixth';
            break;
        case 7:
            ddddValue = 'Seventh';
            break;
        case 8:
            ddddValue = 'Eighth';
            break;
        case 9:
            ddddValue = 'Ninth';
            break;
        case 10:
            ddddValue = 'Tenth';
            break;
        case 11:
            ddddValue = 'Eleventh';
            break;
        case 12:
            ddddValue = 'Twelfth';
            break;
        case 13:
            ddddValue = 'Thirteenth';
            break;
        case 14:
            ddddValue = 'Fourteenth';
            break;
        case 15:
            ddddValue = 'Fifteenth';
            break;
        case 16:
            ddddValue = 'Sixteenth';
            break;
        case 17:
            ddddValue = 'Seventeenth';
            break;
        case 18:
            ddddValue = 'Eighteenth';
            break;
        case 19:
            ddddValue = 'Nineteenth';
            break;
        case 20:
            ddddValue = 'Twentieth';
            break;
        case 21:
            ddddValue = 'Twenty First';
            break;
        case 22:
            ddddValue = 'Twenty Second';
            break;
        case 23:
            ddddValue = 'Twenty Third';
            break;
        case 24:
            ddddValue = 'Twenty Fourth';
            break;
        case 25:
            ddddValue = 'Twenty Fifth';
            break;
        case 26:
            ddddValue = 'Twenty Sixth';
            break;
        case 27:
            ddddValue = 'Twenty Seventh';
            break;
        case 28:
            ddddValue = 'Twenty Eighth';
            break;
        case 29:
            ddddValue = 'Twenty Ninth';
            break;
        case 30:
            ddddValue = 'Thirtieth';
            break;
        case 31:
            ddddValue = 'Thirty First';
            break;
    }

    // Calculating mmmmValue
    let mmmmValue;
    switch (date.getMonth()) {
        case 0:
            mmmmValue = 'January';
            break;
        case 1:
            mmmmValue = 'February';
            break;
        case 2:
            mmmmValue = 'March';
            break;
        case 3:
            mmmmValue = 'April';
            break;
        case 4:
            mmmmValue = 'May';
            break;
        case 5:
            mmmmValue = 'June';
            break;
        case 6:
            mmmmValue = 'July';
            break;
        case 7:
            mmmmValue = 'August';
            break;
        case 8:
            mmmmValue = 'September';
            break;
        case 9:
            mmmmValue = 'October';
            break;
        case 10:
            mmmmValue = 'November';
            break;
        case 11:
            mmmmValue = 'December';
            break;
    }

    const replacements = {
        '<d>': date.getDate().toString(),
        '<dd>': ('0' + date.getDate()).slice(-2),
        '<ddd>': dddValue,
        '<dddd>': ddddValue,
        '<m>': (date.getMonth() + 1).toString(),
        '<mm>': ('0' + (date.getMonth() + 1)).slice(-2),
        '<mmm>': mmmmValue.toString().substr(0, 3),
        '<mmmm>': mmmmValue,
        '<yy>': date.getFullYear().toString().slice(-2),
        '<yyy>': date.getFullYear(),
        '<yyyy>': getYear(date.getFullYear()),
    };

    return replacements;
}

export class UserHandleStructure {
    // Note: These keys will be saved in database
    // so you can not change keys at a later stage.

    static getStructure(key: any, dataType: any, pdfDefault = false): any {
        const structure = {
            key: key,
            x: 0,
            y: 0,
        };
        switch (dataType) {
            case DATA_TYPES.TEXT:
                return { ...structure, ...UserHandleStructure.getTextStructure(pdfDefault) };
            case DATA_TYPES.DATE:
                return { ...structure, ...UserHandleStructure.getDateStructure(pdfDefault) };
            case DATA_TYPES.IMAGE:
                return { ...structure, ...UserHandleStructure.getImageStructure(pdfDefault) };
        }
    }

    static getTextStructure(pdfDefault): any {
        return {
            baseline: 'top', // top, bottom
            align: 'left', // left, right, center
            maxWidth: 0,
            fontSize: 3,
            fontFamily: 'Arial',
            fontStyle: 'Normal',
            textColor: '#000000',
            underline: false,
            value: '', // Used for Constant Field Structure
        };
    }

    static getDateStructure(pdfDefault): any {
        // Format Definition, Example: 1st February 1989
        // <d> -> 1
        // <dd> -> 01
        // <ddd> -> 1st
        // <dddd> -> First
        // <m> -> 2
        // <mm> -> 02
        // <mmm> -> Feb
        // <mmmm> -> February
        // <yy> -> 89
        // <yyy> -> 1989
        // <yyyy> -> Nineteen Eighty Nine

        return {
            baseline: 'top', // top, bottom
            align: 'left', // left, right, center
            maxWidth: 0,
            fontSize: 3,
            fontFamily: 'Arial',
            fontStyle: 'Normal',
            textColor: '#000000',
            underline: false,
            format: '<dd>/<mm>/<yyy>', // Used for Date Format
        };
    }

    static getImageStructure(pdfDefault): any {
        return {
            width: 10,
            height: 10,
        };
    }
}

class ParameterStructure {
    static getStructure(key: any, field: any, dataType: any, displayParameterNameFunc: any, getValueFunc: any): any {
        let finalGetValueFunc;
        if (dataType === DATA_TYPES.DATE) {
            finalGetValueFunc = (dataObject) => {
                const date = new Date(getValueFunc(dataObject));
                const dateReplacements = getDateReplacements(date);
                let dateValue = dataObject.userHandle.format.toString();
                Object.keys(dateReplacements).forEach((dataReplacementKey) => {
                    dateValue = dateValue.replace(dataReplacementKey, dateReplacements[dataReplacementKey]);
                });
                return dateValue;
            };
        } else {
            finalGetValueFunc = getValueFunc;
        }

        return {
            key: key,
            field: field,
            dataType: dataType,
            displayParameterNameFunc: displayParameterNameFunc,
            getValueFunc: finalGetValueFunc,
        };
    }
}

class StudentParameterStructure {
    // Variable name is the parameter key

    static getStructure(displayName: any, variableName: any, dataType = DATA_TYPES.TEXT): any {
        return ParameterStructure.getStructure(
            FIELDS.STUDENT.fieldStructureKey + '-' + variableName,
            FIELDS.STUDENT,
            dataType,
            (dataObject) => {
                return (
                    displayName +
                    (dataObject.userHandle ? ' (top: ' + dataObject.userHandle.y + ', left: ' + dataObject.userHandle.x + ')' : '')
                );
            },
            (dataObject) => dataObject.data.studentList.find((x) => x.id === dataObject.studentId)[variableName]
        );
    }
}

class StudentSessionParameterStructure {
    // Variable name is the parameter key

    static getStructure(displayName: any, variableName: any, getValueFunc: any, dataType = DATA_TYPES.TEXT): any {
        return ParameterStructure.getStructure(
            FIELDS.STUDENT_SESSION.fieldStructureKey + '-' + variableName,
            FIELDS.STUDENT_SESSION,
            dataType,
            (dataObject) => {
                return (
                    displayName +
                    (dataObject.userHandle ? ' (top: ' + dataObject.userHandle.y + ', left: ' + dataObject.userHandle.x + ')' : '')
                );
            },
            getValueFunc
        );
    }
}

export class StudentCustomParameterStructure {
    // Student Parameter Id is the parameter key

    static getStructure(studentParameterId: any, dataType = DATA_TYPES.TEXT): any {
        return ParameterStructure.getStructure(
            FIELDS.STUDENT_CUSTOM.fieldStructureKey + '-' + studentParameterId,
            FIELDS.STUDENT_CUSTOM,
            dataType,
            (dataObject) => {
                return (
                    dataObject.data.studentParameterList.find((x) => x.id === studentParameterId).name +
                    (dataObject.userHandle ? ' (top: ' + dataObject.userHandle.y + ', left: ' + dataObject.userHandle.x + ')' : '')
                );
            },
            (dataObject) => {
                const studentParameterValue = dataObject.data.studentParameterValueList.find(
                    (x) => x.parentStudentParameter === studentParameterId && x.parentStudent === dataObject.studentId
                );
                if (studentParameterValue !== undefined) {
                    return studentParameterValue.value;
                } else {
                    return 'Parameter Not available';
                }
            }
        );
    }
}

class SchoolParameterStructure {
    // Variable name is the parameter key

    static getStructure(displayName: any, variableName: any, dataType = DATA_TYPES.TEXT): any {
        return ParameterStructure.getStructure(
            FIELDS.SCHOOL.fieldStructureKey + '-' + variableName,
            FIELDS.SCHOOL,
            dataType,
            (dataObject) => {
                return (
                    displayName +
                    (dataObject.userHandle ? ' (top: ' + dataObject.userHandle.y + ', left: ' + dataObject.userHandle.x + ')' : '')
                );
            },
            (dataObject) => dataObject.data.school[variableName]
        );
    }
}

class ConstantParameterStructure {
    // Date Type is the parameter key

    static getStructure(dataType = DATA_TYPES.TEXT): any {
        return ParameterStructure.getStructure(
            FIELDS.CONSTANT.fieldStructureKey + '-' + dataType,
            FIELDS.CONSTANT,
            dataType,
            (dataObject) => {
                if (dataObject.userHandle && dataObject.userHandle.value !== '') {
                    return (
                        dataObject.userHandle.value.substr(0, 10) +
                        (dataObject.userHandle.value.length > 10 ? '...' : '') +
                        ' (top: ' +
                        dataObject.userHandle.y +
                        ', left: ' +
                        dataObject.userHandle.x +
                        ')'
                    );
                } else {
                    return dataType;
                }
            },
            (dataObject) => dataObject.userHandle.value
        );
    }
}

export const PARAMETER_LIST = [
    // key -> <FIELD_NAME>-<PARAMETER_NAME>
    // field -> From above mentioned Field L
    // dataType -> From above mentioned Parameter Type List
    // displayName -> For parameter recognition by user on front end side
    // getValueFunc -> it is function to get the value of the parameter from data variable

    /* Student Field */
    /* Done */
    //// Name, Father's Name, Mother's Name, Mobile No., Second Mobile No., Scholar No.,
    //// Address, Profile Image, Gender, Caste, Category, Religion, Father Occupation, Family SSMID,
    //// Child SSMID, Bank Name, Bank Ifsc code, Bank Account No., Aadhar No., Blood Group,
    //// Father Annual Income, RTE, Date Of Birth, Date of Admission
    /* Remaining */
    ////  Bus Stop, Admission Session
    StudentParameterStructure.getStructure(`Name`, 'name'),
    StudentParameterStructure.getStructure(`Father's Name`, 'fathersName'),
    StudentParameterStructure.getStructure(`Mother's Name`, 'motherName'),
    StudentParameterStructure.getStructure(`Mobile No.`, 'mobileNumber'),
    StudentParameterStructure.getStructure(`Alt. Mobile No.`, 'secondMobileNumber'),
    StudentParameterStructure.getStructure(`Scholar No.`, 'scholarNumber'),
    StudentParameterStructure.getStructure(`Address`, 'address'),
    StudentParameterStructure.getStructure(`Profile Image`, 'profileImage', DATA_TYPES.IMAGE),
    StudentParameterStructure.getStructure(`Date of Birth`, 'dateOfBirth', DATA_TYPES.DATE),
    StudentParameterStructure.getStructure(`Gender`, 'gender'),
    StudentParameterStructure.getStructure(`Caste`, 'caste'),
    StudentParameterStructure.getStructure(`Category`, 'newCategoryField'),
    StudentParameterStructure.getStructure(`Religion`, 'newReligionField'),
    StudentParameterStructure.getStructure(`Father's Occupation`, 'fatherOccupation'),
    StudentParameterStructure.getStructure(`Family SSMID`, 'familySSMID'),
    StudentParameterStructure.getStructure(`Child SSMID`, 'childSSMID'),
    StudentParameterStructure.getStructure(`Bank Name`, 'bankName'),
    StudentParameterStructure.getStructure(`Bank Ifsc Code`, 'bankIfscCode'),
    StudentParameterStructure.getStructure(`Bank Account No.`, 'bankAccountNum'),
    StudentParameterStructure.getStructure(`Aadhar No.`, 'aadharNum'),
    StudentParameterStructure.getStructure(`Blood Group`, 'bloodGroup'),
    StudentParameterStructure.getStructure(`Father's Annual Income`, 'fatherAnnualIncome'),
    StudentParameterStructure.getStructure(`RTE`, 'rte'),
    StudentParameterStructure.getStructure(`Date of Admission`, 'dateOfAdmission', DATA_TYPES.DATE),

    /* Student Session Field */
    StudentSessionParameterStructure.getStructure('Class', 'class', (dataObject) => {
        return dataObject.data.classList.find((classs) => {
            return classs.id === dataObject.data.studentSectionList.find((x) => x.parentStudent === dataObject.studentId).parentClass;
        }).name;
    }),
    StudentSessionParameterStructure.getStructure('Section', 'section', (dataObject) => {
        return dataObject.data.divisionList.find((classs) => {
            return classs.id === dataObject.data.studentSectionList.find((x) => x.parentStudent === dataObject.studentId).parentDivision;
        }).name;
    }),
    StudentSessionParameterStructure.getStructure('Roll No.', 'rollNumber', (dataObject) => {
        return dataObject.data.studentSectionList.find((x) => x.parentStudent === dataObject.studentId).rollNumber;
    }),
    StudentSessionParameterStructure.getStructure('Class & Section', 'classSection', (dataObject) => {
        return (
            dataObject.data.classList.find((classs) => {
                return classs.id === dataObject.data.studentSectionList.find((x) => x.parentStudent === dataObject.studentId).parentClass;
            }).name +
            ', ' +
            dataObject.data.divisionList.find((division) => {
                return (
                    division.id === dataObject.data.studentSectionList.find((x) => x.parentStudent === dataObject.studentId).parentDivision
                );
            }).name
        );
    }),

    /* School Field */
    /* Done */
    //// ProfileImage, Principal Signature Image
    //// Name, Print Name, Mobile Number, Address, Pin Code,
    //// Village/City, Block, District, State, Dise Code, Registration Number, Medium, Affiliation Number
    /* Remaining */
    //// Current Session, Board
    SchoolParameterStructure.getStructure(`Logo`, 'profileImage', DATA_TYPES.IMAGE),
    SchoolParameterStructure.getStructure(`Principal's Signature`, 'principalSignatureImage', DATA_TYPES.IMAGE),
    SchoolParameterStructure.getStructure(`Name`, 'name'),
    SchoolParameterStructure.getStructure(`Print Name`, 'printName'),
    SchoolParameterStructure.getStructure(`Mobile No.`, 'mobileNumber'),
    SchoolParameterStructure.getStructure(`Address`, 'address'),
    SchoolParameterStructure.getStructure(`Pin Code`, 'pincode'),
    SchoolParameterStructure.getStructure(`Village/City`, 'villageCity'),
    SchoolParameterStructure.getStructure(`Block`, 'block'),
    SchoolParameterStructure.getStructure(`District`, 'district'),
    SchoolParameterStructure.getStructure(`State`, 'state'),
    SchoolParameterStructure.getStructure(`Dise Code`, 'diseCode'),
    SchoolParameterStructure.getStructure(`Registration No.`, 'registrationNumber'),
    SchoolParameterStructure.getStructure(`Affiliation No.`, 'affiliationNumber'),
    SchoolParameterStructure.getStructure(`Medium`, 'medium'),

    /* Constant Field */
    ConstantParameterStructure.getStructure(DATA_TYPES.TEXT),
];
