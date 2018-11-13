import {Component, Input, OnInit} from '@angular/core';

import {ClassService} from '../../../../services/class.service';
import {StudentService} from '../../student.service';
import {VehicleService} from '../../../vehicle/vehicle.service';
import {SchoolService} from '../../../../services/school.service';

import * as XLSX from 'xlsx';

type AOA = any[][];

// Headers
const HEADERS = [
    '*Name', // 0
    '*Father\'s Name', // 1
    'Mother\'s Name', // 2
    '*Class', // 3
    'Section', // 4
    'Mobile Number', // 5
    'Roll No.', // 6
    'Scholar No.', // 7
    'Date of Birth', // 8
    'Admission Session', // 9
    'Gender', // 10
    'Category', // 11
    'Religion', // 12
    'Blood Group', // 13
    'Family SSMID', // 14
    'Child SSMID', // 15
    'Aadhar Number', // 16
    'Caste', // 17
    'Bank Name', // 18
    'Bank Account Number', // 19
    'Father\'s Occupation', // 20
    'Father\'s Annual Income', // 21
    'Bus Stop', // 22
    'RTE', // 23
    'Address', // 24
    'Remark', // 25
];

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
const ADMISSION_SESSION_VALUES = [
    'Admission Session Values',
    'Session 2017-18',
    'Session 2018-19',
];

// Gender Values
const GENDER_VALUES = [
    'Gender Values',
    'Male',
    'Female',
    'Other',
];

// Category Values
const CATEGORY_VALUES = [
    'Category Values',
    'SC',
    'ST',
    'OBC',
    'Gen.',
];

    // Religion Values
const RELIGION_VALUES = [
    'Religion Values',
    'Hinduism',
    'Jainism',
    'Islam',
    'Christianity',
];

// Blood Group Values
const BLOOD_GROUP_VALUES = [
    'Blood Group Values',
    'O +',
    'O -',
    'A +',
    'A -',
    'B +',
    'B -',
    'AB +',
    'AB -',
];

// RTE Values
const RTE_VALUES = [
    'RTE Values',
    'YES',
    'NO',
    'UNKNOWN',
];


@Component({
    selector: 'upload-list',
    templateUrl: './upload-list.component.html',
    styleUrls: ['./upload-list.component.css'],
    providers: [StudentService, ClassService, VehicleService, SchoolService],
})

export class UploadListComponent implements OnInit {

    @Input() user;

    displayStudentNumber = 0;

    data: any;

    headers = HEADERS;

    template: any;
    exportFileName = 'students_list_template.csv';

    busStopList: any;

    // classSectionList = [];
    sessionList = [];

    classList = [];
    sectionList = [];


    selectedSession: any;

    studentList: any;

    fillerRows: any;

    isLoading = false;

    constructor(private studentService: StudentService,
                private classService: ClassService,
                private schoolService: SchoolService,
                private vehicleService: VehicleService) { }

    ngOnInit(): void {
        let request_bus_stop_data = {
            parentSchool: this.user.activeSchool.dbId,
        };
        let request_class_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        this.isLoading = true;
        Promise.all([
            this.vehicleService.getBusStopList(request_bus_stop_data, this.user.jwt),
            this.classService.getClassList(this.user.jwt),
            this.schoolService.getSessionList(this.user.jwt),
            this.classService.getSectionList(this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.busStopList = value[0];
            this.classList = value[1];
            this.populateSessionList(value[2]);
            this.sectionList = value[3];
            this.initializeTemplate();
        }, error => {
            this.isLoading = false;
        });
    }

    populateSessionList(sessionList: any): void {
        this.sessionList = sessionList;
        this.sessionList.every(session => {
            if (session.dbId === this.user.activeSchool.currentSessionDbId) {
                this.selectedSession = session;
                return false;
            }
            return true;
        });
    }

    /*handleSessionChange(): void {
        this.studentList = null;
        let request_class_data = {
            sessionDbId: this.selectedSession.dbId,
        };
        this.isLoading = true;
        this.classService.getClassSectionList(request_class_data, this.user.jwt).then(classSectionList => {
            this.isLoading = false;
            this.classSectionList = classSectionList;
        }, error => {
            this.isLoading = false;
        });
    }*/

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

            ['Bus Stop Values'].concat(this.busStopList.map(a => a.stopName)),

            ['Date Format', 'dd-mm-yyyy or dd/mm/yyyy'],

            HEADERS,

        ];

        this.fillerRows = 11;
    }

    onFileChange(evt: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
            // this.data = XLSX.utils.sheet_to_row_object_array(ws, {'date_format': 'dd/mm/yyyy'});

            this.validateAndPopulateData();

        };
        reader.readAsBinaryString(target.files[0]);
        evt.target.value = '';
    }

    export(): void {
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.template);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.exportFileName);
    }

    validateAndPopulateData(): void {
        this.studentList = null;
        let checkFailed = false;
        this.data.every((student, index) => {
            if (index >= this.fillerRows && !this.validateStudent(student, index)) {
                checkFailed = true;
                return false;
            }
            return true;
        });
        if (checkFailed) {
            return;
        }
        this.studentList = this.data.slice(this.fillerRows);
    }

    validateStudent(student: any, index: number): boolean {

        let rowNumber = index+1;

        // Check Name
        if (student[0] === undefined || student[0].length < 3) {
            alert('Row Number: ' + (rowNumber) +', invalid student\'s name');
            return false;
        }

        // Check Father's Name
        if (student[1] === undefined || student[1].length < 3) {
            alert('Row Number: ' + (rowNumber) +', invalid father\'s name');
            return false;
        }

        // Check Mother's Name
        if (student[2] !== undefined && student[2].length < 3) {
            alert('Row Number: ' + (rowNumber) +', invalid mother\'s name');
            return false;
        }

        // Check Class
        if (CLASS_VALUES.indexOf(student[3]) === -1) {
            alert('Row Number: ' + (rowNumber) +', invalid class name');
            return false;
        }

        // Check Section
        if (student[4] !== undefined && SECTION_VALUES.indexOf(student[4]) === -1) {
            alert('Row Number: ' + (rowNumber) +', invalid section name');
            return false;
        }

        // Check Mobile Number
        if (!this.undefinedOrNumberLength(student[5], 10)) {
            alert('Row Number: ' + (rowNumber) +', invalid mobile number');
            return false;
        }

        // Check Date of Birth
        if (!this.validateDate(student[8])) {
            alert('Row Number: ' + (rowNumber) +', invalid date of birth');
            return false;
        }

        // Check Admission Session
        if (student[9] !== undefined && ADMISSION_SESSION_VALUES.indexOf(student[9]) === -1) {
            alert('Row Number: ' + (rowNumber) +', invalid admission Session');
            return false;
        }

        // Check Gender
        if (student[10] !== undefined && GENDER_VALUES.indexOf(student[10]) === -1) {
            alert('Row Number: ' + (rowNumber) +', invalid gender');
            return false;
        }

        // Check Category
        if (student[11] !== undefined && CATEGORY_VALUES.indexOf(student[11]) === -1) {
            alert('Row Number: ' + (rowNumber) + ', invalid category');
            return false;
        }

        // Check Religion
        if (student[12] !== undefined && RELIGION_VALUES.indexOf(student[12]) === -1) {
            alert('Row Number: ' + (rowNumber) + ', invalid religion');
            return false;
        }

        // Check Blood Group
        if (student[13] !== undefined && BLOOD_GROUP_VALUES.indexOf(student[13]) === -1) {
            alert('Row Number: ' + (rowNumber) + ', invalid blood group');
            return false;
        }

        // Check Family SSMID
        if (!this.undefinedOrNumberLength(student[14], 8)) {
            alert('Row Number: ' + (rowNumber) + ', invalid family ssmid');
            return false;
        }

        // Check Child SSMID
        if (!this.undefinedOrNumberLength(student[15], 9)) {
            alert('Row Number: ' + (rowNumber) + ', invalid child ssmid');
            return false;
        }

        // Check Aadhar Number
        if (!this.undefinedOrNumberLength(student[16], 12)) {
            alert('Row Number: ' + (rowNumber) + ', invalid aadhar number');
            return false;
        }

        // Check Bus Stop
        if (student[22] !== undefined && this.busStopList.map(a => a.stopName).indexOf(student[22]) === -1) {
            alert('Row Number: ' + (rowNumber) + ', invalid bus stop');
            return false;
        }

        // Check RTE
        if (student[23] !== undefined && RTE_VALUES.indexOf(student[23]) === -1) {
            alert('Row Number: ' + (rowNumber) + ', invalid rte value');
            return false;
        }

        return true;

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
        if(inputText.match(dateformat))
        {
            //document.form1.text1.focus();

            //Test which seperator is used '/' or '-'
            let opera1 = inputText.split('/');
            let opera2 = inputText.split('-');
            let lopera1 = opera1.length;
            let lopera2 = opera2.length;

            // Extract the string into month, date and year
            let pdate;
            if (lopera1>1)
            {
                pdate = inputText.split('/');
            }
            else if (lopera2>1)
            {
                pdate = inputText.split('-');
            }
            let dd = parseInt(pdate[0]);
            let mm  = parseInt(pdate[1]);
            let yy = parseInt(pdate[2]);

            if (yy < 100 && yy > 30) {
                yy += 1900;
            }
            if (yy <= 30) {
                yy += 2000;
            }

            // Create list of days of a month [assume there is no leap year by default]
            let ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
            if (mm==1 || mm>2)
            {
                if (dd>ListofDays[mm-1])
                {
                    alert('Days: Invalid date format!');
                    return false;
                }
            }
            if (mm==2)
            {
                var lyear = false;
                if ( (!(yy % 4) && yy % 100) || !(yy % 400))
                {
                    lyear = true;
                }
                if ((lyear==false) && (dd>=29))
                {
                    alert('Non Leap Year: Invalid date format!');
                    return false;
                }
                if ((lyear==true) && (dd>29))
                {
                    alert('Leap Year: Invalid date format!');
                    return false;
                }
            }
            return true;
        }
        else
        {
            alert("Date: Invalid date format!");
            return false;
        }

    }

    undefinedOrNumberLength(value: any, length: number): boolean {
        if (value === undefined) {
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
        this.studentList.forEach(student => {
            student_list.push(this.getServerRequest(student));
        });
        this.isLoading = true;
        this.studentService.createStudentFullProfileBatch(student_list, this.user.jwt).then(response => {
            this.isLoading = false;
            this.studentList = null;
            alert(response.message);
        }, error => {
            this.isLoading = false;
        });
    }

    getServerRequest(student: any): any {
        let data = {
            'name': student[0],
            'fathersName': student[1],
            'motherName': student[2],
            'parentDivision': this.getParentSection(student[4]),
            'mobileNumber': parseInt(student[5]),
            'rollNumber': student[6],
            'scholarNumber': student[7],
            'dateOfBirth': this.getDate(student[8]),
            'admissionSession': this.getSession(student[9]),
            'gender': student[10],
            'category': student[11],
            'religion': student[12],
            'bloodGroup': student[13],
            'familySSMID': parseInt(student[14]),
            'childSSMID': parseInt(student[15]),
            'aadharNumber': parseInt(student[16]),
            'caste': student[17],
            'bankName': student[18],
            'bankAccountNumber': student[19],
            'fatherOccupation': student[20],
            'fatherAnnualIncome': student[21],
            'currentBusStop': this.getBusStop(student[22]),
            'rte': student[23],
            'address': student[24],
            'remark': student[25],
            'parentSchool': this.user.activeSchool.dbId,
            'parentClass': this.getParentClass(student[3]),
            'parentSession': this.selectedSession.dbId,
        };
        return data;
    }

    getBusStop(data: any): any {
        if (data === undefined) {
            return null;
        }

        let result = null;
        this.busStopList.every(busStop => {
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
        this.sessionList.every(session => {
            if (session.name === data) {
                result = session.dbId;
                return false;
            }
            return true;
        });
        return result;
    }

    getDate(inputText: any): any {

        let result = null;

        if (inputText === null || inputText === undefined) {
            return true;
        }

        if (typeof inputText !== 'string') {
            return false;
        }

        let dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-](\d{4}|\d{2})$/;

        // Match the date format through regular expression
        if(inputText.match(dateformat))
        {

            //Test which seperator is used '/' or '-'
            let opera1 = inputText.split('/');
            let opera2 = inputText.split('-');
            let lopera1 = opera1.length;
            let lopera2 = opera2.length;

            // Extract the string into month, date and year
            let pdate;
            if (lopera1>1)
            {
                pdate = inputText.split('/');
            }
            else if (lopera2>1)
            {
                pdate = inputText.split('-');
            }
            let dd = parseInt(pdate[0]);
            let mm  = parseInt(pdate[1]);
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

    /*getParentSection(className: any, sectionName: any): any {
        if (sectionName === undefined) {
            sectionName = 'Section - A';
        }
        let result = null;
        this.classSectionList.every(classs => {
            if (classs.name === className) {
                classs.sectionList.every(section => {
                    if (section.name === sectionName) {
                        result = section.dbId;
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        return result;
    }*/

    getParentSection(sectionName: any): any {
        if (sectionName === undefined) {
            sectionName = 'Section - A';
        }
        let result = null;
        this.sectionList.every(section => {
            if (section.name === sectionName) {
                result = section.id;
                return false;
            }
            return true;
        });
        /*this.classSectionList.every(classs => {
            if (classs.name === className) {
                classs.sectionList.every(section => {
                    if (section.name === sectionName) {
                        result = section.dbId;
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });*/
        return result;
    }

    getParentClass(className: any): any {
        if (className === undefined) {
            className = 'Class - 12';
        }
        let result = null;
        this.classList.every(classs => {
            if (classs.name === className) {
                result = classs.dbId;
                return false;
            }
            return true;
        });
        return result;
    }

}
