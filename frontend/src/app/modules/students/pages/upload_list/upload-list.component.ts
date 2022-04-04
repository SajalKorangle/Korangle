import { Component, Input, OnInit } from '@angular/core';

import { ClassService } from '../../../../services/modules/class/class.service';
import { StudentOldService } from '../../../../services/modules/student/student-old.service';
import { VehicleOldService } from '../../../../services/modules/vehicle/vehicle-old.service';
import { SchoolService } from '../../../../services/modules/school/school.service';

import { ExcelService } from '../../../../excel/excel-service';
import { DataStorage } from '../../../../classes/data-storage';

// Constants
const NAME = 0;
const FATHER_NAME = 1;
const MOTHER_NAME = 2;
const CLASS = 3;
const SECTION = 4;
const MOBILE_NUMBER = 5;
const ROLL_NUMBER = 6;
const SCHOLAR_NUMBER = 7;
const DATE_OF_BIRTH = 8;
const ADMISSION_SESSION = 9;
const DATE_OF_ADMISSION = 10;
const GENDER = 11;
const CATEGORY = 12;
const RELIGION = 13;
const BLOOD_GROUP = 14;
const FAMILY_SSMID = 15;
const CHILD_SSMID = 16;
const AADHAR_NUMBER = 17;
const CASTE = 18;
const BANK_NAME = 19;
const Bank_IFSC_CODE = 20;
const BANK_ACCOUNT_NUMBER = 21;
const FATHER_OCCUPATION = 22;
const FATHER_ANNUAL_INCOME = 23;
const BUS_STOP = 24;
const RTE = 25;
const ADDRESS = 26;
const REMARK = 27;
const SECOND_MOBILE_NUMBER = 28;

// HEADERS
const HEADERS = [];

HEADERS[NAME] = '*Name';
HEADERS[FATHER_NAME] = "*Father's Name";
HEADERS[MOTHER_NAME] = "Mother's Name";
HEADERS[CLASS] = '*Class';
HEADERS[SECTION] = 'Section';
HEADERS[MOBILE_NUMBER] = 'Mobile Number';
HEADERS[SECOND_MOBILE_NUMBER] = 'Alternate Mobile Number';
HEADERS[ROLL_NUMBER] = 'Roll No.';
HEADERS[SCHOLAR_NUMBER] = 'Scholar No.';
HEADERS[DATE_OF_BIRTH] = 'Date of Birth';
HEADERS[ADMISSION_SESSION] = 'Admission Session';
HEADERS[DATE_OF_ADMISSION] = 'Date of Admission';
HEADERS[GENDER] = 'Gender';
HEADERS[CATEGORY] = 'Category';
HEADERS[RELIGION] = 'Religion';
HEADERS[BLOOD_GROUP] = 'Blood Group';
HEADERS[FAMILY_SSMID] = 'Family SSMID';
HEADERS[CHILD_SSMID] = 'Child SSMID';
HEADERS[AADHAR_NUMBER] = 'Aadhar Number';
HEADERS[CASTE] = 'Caste';
HEADERS[BANK_NAME] = 'Bank Name';
HEADERS[Bank_IFSC_CODE] = 'Bank Ifsc Code';
HEADERS[BANK_ACCOUNT_NUMBER] = 'Bank Account Number';
HEADERS[FATHER_OCCUPATION] = "Father's Occupation";
HEADERS[FATHER_ANNUAL_INCOME] = "Father's Annual Income";
HEADERS[BUS_STOP] = 'Bus Stop';
HEADERS[RTE] = 'RTE';
HEADERS[ADDRESS] = 'Address';
HEADERS[REMARK] = 'Remark';

// Class Values
const CLASS_VALUES = [
    'Class Values',
    'Class - 12',
    'Class - 11',
    'Class - 10',
    'Class - 9',
    'Class - 8',
    'Class - 7',
    'Class - 6',
    'Class - 5',
    'Class - 4',
    'Class - 3',
    'Class - 2',
    'Class - 1',
    'U.K.G.',
    'L.K.G.',
    'Nursery',
    'Play Group',
];

// Section Values
const SECTION_VALUES = [
    'Section Values',
    'Section - A',
    'Section - B',
    'Section - C',
    'Section - D',
    'Section - E',
    'Section - F',
    'Section - G',
    'Section - H',
    'Section - I',
    'Section - J',
];

// Admission Session Values
const ADMISSION_SESSION_VALUES = ['Admission Session Values', 'Session 2017-18', 'Session 2018-19', 'Session 2019-20', 'Session 2020-21', 'Session 2021-22', 'Session 2022-23'];

// Gender Values
const GENDER_VALUES = ['Gender Values', 'Male', 'Female', 'Other'];

// Category Values
const CATEGORY_VALUES = ['Category Values', 'SC', 'ST', 'OBC', 'Gen.'];

// Religion Values
const RELIGION_VALUES = ['Religion Values', 'Hinduism', 'Jainism', 'Islam', 'Christianity'];

// Blood Group Values
const BLOOD_GROUP_VALUES = ['Blood Group Values', 'O +', 'O -', 'A +', 'A -', 'B +', 'B -', 'AB +', 'AB -'];

// RTE Values
const RTE_VALUES = ['RTE Values', 'YES', 'NO'];

@Component({
    selector: 'upload-list',
    templateUrl: './upload-list.component.html',
    styleUrls: ['./upload-list.component.css'],
    providers: [SchoolService, StudentOldService, ClassService, VehicleOldService],
})
export class UploadListComponent implements OnInit {
    user;

    displayStudentNumber = 0;

    data: any;

    headers = HEADERS;

    template: any;
    exportFileName = 'students_list_template.csv';

    busStopList: any;
    busStopNameList = [];

    // classSectionList = [];
    sessionList = [];

    classList = [];
    sectionList = [];

    selectedSession: any;

    studentList: any;

    numberOfFillerRows: any;

    errorList = [];
    deletedList = [];

    isLoading = false;

    constructor(
        private studentService: StudentOldService,
        public classService: ClassService,
        private schoolService: SchoolService,
        private excelService: ExcelService,
        private vehicleService: VehicleOldService
    ) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        let request_bus_stop_data = {
            parentSchool: this.user.activeSchool.dbId,
        };
        let request_class_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        this.isLoading = true;
        Promise.all([
            this.vehicleService.getBusStopList(request_bus_stop_data, this.user.jwt),
            this.classService.getObjectList(this.classService.classs, {}),
            this.schoolService.getObjectList(this.schoolService.session, {}),
            this.classService.getObjectList(this.classService.division, {}),
        ]).then(
            (value) => {
                this.isLoading = false;
                this.busStopList = value[0];
                this.busStopNameList = this.busStopList.map((a) => a.stopName);
                this.classList = value[1];
                this.populateSessionList(value[2]);
                this.sectionList = value[3];
                this.initializeTemplate();
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    populateSessionList(sessionList: any): void {
        this.sessionList = sessionList;
        this.sessionList.every((session) => {
            if (session.id === this.user.activeSchool.currentSessionDbId) {
                this.selectedSession = session;
                return false;
            }
            return true;
        });
    }

    initializeTemplate(): void {
        this.template = [
            CLASS_VALUES,

            SECTION_VALUES,

            ADMISSION_SESSION_VALUES,

            GENDER_VALUES,

            CATEGORY_VALUES,

            RELIGION_VALUES,

            BLOOD_GROUP_VALUES,

            RTE_VALUES,

            ['Bus Stop Values'].concat(this.busStopNameList),

            ['Date Format', 'dd-mm-yyyy or dd/mm/yyyy'],

            HEADERS,
        ];

        this.numberOfFillerRows = 11;
    }

    onFileChange(evt: any) {
        if (evt.target.files.length !== 1) throw new Error('Cannot use multiple files');
        this.excelService.getData(evt, (result, file) => {
            console.log(result.data);
            this.data = result.data;
            this.validateAndPopulateData();
        });
        evt.target.value = '';

        /* wire up file reader */
        /*const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {

            this.data = this.excelService.getData(event);

            this.validateAndPopulateData();

        };
        reader.readAsBinaryString(target.files[0]);*/
        // evt.target.value = '';
    }

    export(): void {
        this.excelService.downloadFile(this.template, this.exportFileName);
    }

    validateAndPopulateData(): void {
        this.studentList = null;
        this.errorList = [];
        this.deletedList = [];

        console.log('prev', this.data);
        this.data = this.data.filter((value) => {
            if (value.length <= 1) {
                return false;
            }
            return true;
        });

        this.data.forEach((student, index) => {
            if (index >= this.numberOfFillerRows) {
                let dualList = this.validateStudent(student);
                let errorColumnList = dualList[0];
                let deletedColumnList = dualList[1];
                if (errorColumnList.length > 0) {
                    this.errorList.push({
                        row: index - this.numberOfFillerRows,
                        column: errorColumnList,
                    });
                }
                if (deletedColumnList.length > 0) {
                    this.deletedList.push({
                        row: index - this.numberOfFillerRows,
                        column: deletedColumnList,
                    });
                }
            }
        });
        this.studentList = this.data.slice(this.numberOfFillerRows);
    }

    trimCell(student: any, column: any): void {
        if (typeof student[column] === 'string') {
            student[column] = student[column].trim();
        }
    }

    toCamelCase(student: any, column: any): void {
        if (typeof student[column] === 'string' && student[column].length > 2) {
            student[column] = student[column].charAt(0).toUpperCase() + student[column].substr(1).toLowerCase();
        }
    }

    validateStudent(student: any): any {
        let dualList = [];

        let errorColumnList = [];
        let deletedColumnList = [];

        student.forEach((item, index) => {
            if (item == '' || item == undefined) {
                student[index] = null;
            }
        });

        // Check Name
        this.trimCell(student, NAME);
        if (student[NAME] === null || student[NAME].length < 3) {
            errorColumnList.push(NAME);
        }

        // Check Father's Name
        this.trimCell(student, FATHER_NAME);
        if (student[FATHER_NAME] === null || student[FATHER_NAME].length < 3) {
            errorColumnList.push(FATHER_NAME);
        }

        // Check Mother's Name
        this.trimCell(student, MOTHER_NAME);
        if (student[MOTHER_NAME] !== null && student[MOTHER_NAME].length < 3) {
            errorColumnList.push(MOTHER_NAME);
        }

        // Check Class
        this.trimCell(student, CLASS);
        // this.toCamelCase(student, CLASS);
        if (CLASS_VALUES.indexOf(student[CLASS]) === -1) {
            errorColumnList.push(CLASS);
        }

        // Check Section
        this.trimCell(student, SECTION);
        if (student[SECTION] !== null && SECTION_VALUES.indexOf(student[SECTION]) === -1) {
            errorColumnList.push(SECTION);
        }

        // Check Mobile Number
        this.trimCell(student, MOBILE_NUMBER);
        if (!this.nullOrNumberLength(student[MOBILE_NUMBER], 10)) {
            student[MOBILE_NUMBER] = null;
            deletedColumnList.push(MOBILE_NUMBER);
        }

        // Check Alternate Mobile Number
        this.trimCell(student, SECOND_MOBILE_NUMBER);
        if (!this.nullOrNumberLength(student[SECOND_MOBILE_NUMBER], 10)) {
            student[SECOND_MOBILE_NUMBER] = null;
            deletedColumnList.push(SECOND_MOBILE_NUMBER);
        }

        // Check Date of Birth
        this.trimCell(student, DATE_OF_BIRTH);
        if (!this.validateDate(student[DATE_OF_BIRTH])) {
            errorColumnList.push(DATE_OF_BIRTH);
        }

        // Check Date of Admission
        this.trimCell(student, DATE_OF_ADMISSION);
        if (!this.validateDate(student[DATE_OF_ADMISSION])) {
            errorColumnList.push(DATE_OF_ADMISSION);
        }

        // Check Admission Session
        this.trimCell(student, ADMISSION_SESSION);
        this.toCamelCase(student, ADMISSION_SESSION);
        if (student[ADMISSION_SESSION] !== null && ADMISSION_SESSION_VALUES.indexOf(student[ADMISSION_SESSION]) === -1) {
            errorColumnList.push(ADMISSION_SESSION);
        }

        // Check Gender
        this.trimCell(student, GENDER);
        this.toCamelCase(student, GENDER);
        if (student[GENDER] !== null && GENDER_VALUES.indexOf(student[GENDER]) === -1) {
            errorColumnList.push(GENDER);
        }

        // Check Category
        this.trimCell(student, CATEGORY);
        if (student[CATEGORY] !== null) {
            student[CATEGORY] = student[CATEGORY].toUpperCase();
            if (student[CATEGORY] === 'GEN.') {
                this.toCamelCase(student, CATEGORY);
            }
            if (CATEGORY_VALUES.indexOf(student[CATEGORY]) === -1) {
                errorColumnList.push(CATEGORY);
            }
        }

        // Check Religion
        this.trimCell(student, RELIGION);
        this.toCamelCase(student, RELIGION);
        if (student[RELIGION] !== null && RELIGION_VALUES.indexOf(student[RELIGION]) === -1) {
            errorColumnList.push(RELIGION);
        }

        // Check Blood Group
        this.trimCell(student, BLOOD_GROUP);
        if (student[BLOOD_GROUP] !== null) {
            student[BLOOD_GROUP] = student[BLOOD_GROUP].toUpperCase();
            if (BLOOD_GROUP_VALUES.indexOf(student[BLOOD_GROUP]) === -1) {
                errorColumnList.push(BLOOD_GROUP);
            }
        }

        // Check Family SSMID
        this.trimCell(student, FAMILY_SSMID);
        if (!this.nullOrNumberLength(student[FAMILY_SSMID], 8)) {
            student[FAMILY_SSMID] = null;
            deletedColumnList.push(FAMILY_SSMID);
        }

        // Check Child SSMID
        this.trimCell(student, CHILD_SSMID);
        if (!this.nullOrNumberLength(student[CHILD_SSMID], 9)) {
            student[CHILD_SSMID] = null;
            deletedColumnList.push(CHILD_SSMID);
        }

        // Check Aadhar Number
        this.trimCell(student, AADHAR_NUMBER);
        if (!this.nullOrNumberLength(student[AADHAR_NUMBER], 12)) {
            student[AADHAR_NUMBER] = null;
            deletedColumnList.push(AADHAR_NUMBER);
        }

        // Check Bus Stop
        this.trimCell(student, BUS_STOP);
        if (student[BUS_STOP] !== null && this.busStopNameList.indexOf(student[BUS_STOP]) === -1) {
            errorColumnList.push(BUS_STOP);
        }

        // Check RTE
        this.trimCell(student, RTE);
        if (student[RTE] !== null) {
            student[RTE] = student[RTE].toUpperCase();
            if (RTE_VALUES.indexOf(student[RTE]) === -1) {
                errorColumnList.push(RTE);
            }
        }

        dualList.push(errorColumnList);
        dualList.push(deletedColumnList);

        return dualList;
    }

    validateDate(inputText: any): boolean {
        if (inputText === null || inputText === undefined) {
            return true;
        }

        if (typeof inputText !== 'string') {
            return false;
        }

        let dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-](\d{4}|\d{2})$/;

        // Match the date format through regular expression
        if (inputText.match(dateformat)) {
            //document.form1.text1.focus();

            //Test which seperator is used '/' or '-'
            let opera1 = inputText.split('/');
            let opera2 = inputText.split('-');
            let lopera1 = opera1.length;
            let lopera2 = opera2.length;

            // Extract the string into month, date and year
            let pdate;
            if (lopera1 > 1) {
                pdate = inputText.split('/');
            } else if (lopera2 > 1) {
                pdate = inputText.split('-');
            }
            let dd = parseInt(pdate[0]);
            let mm = parseInt(pdate[1]);
            let yy = parseInt(pdate[2]);

            if (yy < 100 && yy > 30) {
                yy += 1900;
            }
            if (yy <= 30) {
                yy += 2000;
            }

            // Create list of days of a month [assume there is no leap year by default]
            let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (mm == 1 || mm > 2) {
                if (dd > ListofDays[mm - 1]) {
                    return false;
                }
            }
            if (mm == 2) {
                var lyear = false;
                if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                    lyear = true;
                }
                if (lyear == false && dd >= 29) {
                    return false;
                }
                if (lyear == true && dd > 29) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    nullOrNumberLength(value: any, length: number): boolean {
        if (value === null) {
            return true;
        }
        if (isNaN(parseInt(value))) {
            return false;
        }
        if (value.toString() !== parseInt(value).toString()) {
            return false;
        }
        if (value.toString().length !== length) {
            return false;
        }
        return true;
    }

    uploadStudentList(): void {
        let student_list = [];
        this.studentList.forEach((student) => {
            student_list.push(this.getServerRequest(student));
        });
        console.log(student_list);
        this.isLoading = true;
        this.studentService.createStudentFullProfileBatch(student_list, this.user.jwt).then(
            (response) => {
                this.isLoading = false;
                this.studentList = null;
                alert(response.message);
            },
            (error) => {
                this.isLoading = false;
            }
        );
    }

    getServerRequest(student: any): any {
        let data = {
            name: student[NAME],
            fathersName: student[FATHER_NAME],
            motherName: student[MOTHER_NAME],
            parentDivision: this.getParentSection(student[SECTION]),
            mobileNumber: parseInt(student[MOBILE_NUMBER]),
            secondMobileNumber: parseInt(student[SECOND_MOBILE_NUMBER]),
            rollNumber: student[ROLL_NUMBER],
            scholarNumber: student[SCHOLAR_NUMBER],
            dateOfBirth: this.getDate(student[DATE_OF_BIRTH]),
            admissionSession: this.getSession(student[ADMISSION_SESSION]),
            dateOfAdmission: this.getDate(student[DATE_OF_ADMISSION]),
            gender: student[GENDER],
            newCategoryField: student[CATEGORY],
            newReligionField: student[RELIGION],
            bloodGroup: student[BLOOD_GROUP],
            familySSMID: parseInt(student[FAMILY_SSMID]),
            childSSMID: parseInt(student[CHILD_SSMID]),
            aadharNum: parseInt(student[AADHAR_NUMBER]),
            caste: student[CASTE],
            bankName: student[BANK_NAME],
            bankIfscCode: student[Bank_IFSC_CODE],
            bankAccountNum: student[BANK_ACCOUNT_NUMBER],
            fatherOccupation: student[FATHER_OCCUPATION],
            fatherAnnualIncome: student[FATHER_ANNUAL_INCOME],
            currentBusStop: this.getBusStop(student[BUS_STOP]),
            rte: student[RTE],
            address: student[ADDRESS],
            remark: student[REMARK],
            parentSchool: this.user.activeSchool.dbId,
            parentClass: this.getParentClass(student[CLASS]),
            parentSession: this.selectedSession.id,
        };
        Object.keys(data).forEach((keys) => {
            if (data[keys] === undefined) {
                data[keys] = null;
            }
        });
        return data;
    }

    getBusStop(data: any): any {
        if (data === null) {
            return null;
        }

        let result = null;
        this.busStopList.every((busStop) => {
            if (busStop.stopName === data) {
                result = busStop.id;
                return false;
            }
            return true;
        });
        return result;
    }

    getSession(data: any): any {
        let result = null;
        this.sessionList.every((session) => {
            if (session.name === data) {
                result = session.id;
                return false;
            }
            return true;
        });
        return result;
    }

    getDate(inputText: any): any {
        let result = null;

        if (inputText === null || inputText === undefined) {
            return result;
        }

        if (typeof inputText !== 'string') {
            return result;
        }

        let dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-](\d{4}|\d{2})$/;

        // Match the date format through regular expression
        if (inputText.match(dateformat)) {
            //Test which seperator is used '/' or '-'
            let opera1 = inputText.split('/');
            let opera2 = inputText.split('-');
            let lopera1 = opera1.length;
            let lopera2 = opera2.length;

            // Extract the string into month, date and year
            let pdate;
            if (lopera1 > 1) {
                pdate = inputText.split('/');
            } else if (lopera2 > 1) {
                pdate = inputText.split('-');
            }
            let dd = parseInt(pdate[0]);
            let mm = parseInt(pdate[1]);
            let yy = parseInt(pdate[2]);

            if (yy < 100 && yy > 30) {
                yy += 1900;
            }
            if (yy <= 30) {
                yy += 2000;
            }

            result = yy.toString() + '-' + mm.toString() + '-' + dd.toString();
        }

        return result;
    }

    getParentSection(sectionName: any): any {
        if (sectionName === null) {
            sectionName = 'Section - A';
        }
        let result = null;
        this.sectionList.every((section) => {
            if (section.name === sectionName) {
                result = section.id;
                return false;
            }
            return true;
        });
        return result;
    }

    getParentClass(className: any): any {
        if (className === null) {
            className = 'Class - 12';
        }
        let result = null;
        this.classList.every((classs) => {
            if (classs.name === className) {
                result = classs.id;
                return false;
            }
            return true;
        });
        return result;
    }

    getNumberOfErrors(): number {
        let numberOfErrors = 0;
        this.errorList.forEach((row) => {
            numberOfErrors += row.column.length;
        });
        console.log(numberOfErrors);
        return numberOfErrors;
    }

    getNumberOfDeletedCells(): number {
        let numberOfDeletedCells = 0;
        this.deletedList.forEach((row) => {
            numberOfDeletedCells += row.column.length;
        });
        console.log(numberOfDeletedCells);
        return numberOfDeletedCells;
    }

    isErrorCell(rowIndex: number, columnIndex: number): boolean {
        let result = false;
        this.errorList.every((item) => {
            if (item.row === rowIndex) {
                item.column.every((itemTwo) => {
                    if (itemTwo === columnIndex) {
                        result = true;
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        return result;
    }

    isDeletedCell(rowIndex: number, columnIndex: number): boolean {
        let result = false;
        this.deletedList.every((item) => {
            if (item.row === rowIndex) {
                item.column.every((itemTwo) => {
                    if (itemTwo === columnIndex) {
                        result = true;
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        return result;
    }
}
