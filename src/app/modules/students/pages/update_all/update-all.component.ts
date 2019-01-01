import {Component, Input, OnInit} from '@angular/core';

import {EmitterService} from '../../../../services/emitter.service';
import {ClassService} from '../../../../services/class.service';
import {StudentService} from '../../student.service';

import * as XLSX from 'xlsx';

class ColumnFilter {
    showSerialNumber = true;
    showName = true;
    showClassName = false;
    showRollNumber = false;
    showFathersName = true;
    showMobileNumber = true;
    showScholarNumber = false;
    showDateOfBirth = false;
    showMotherName = false;
    showGender = false;
    showCaste = false;
    showCategory = false;
    showReligion = false;
    showFatherOccupation = false;
    showAddress = true;
    showChildSSMID = false;
    showFamilySSMID = false;
    showBankName = false;
    showBankAccountNum = false;
    showAadharNum = false;
    showBloodGroup = false;
    showFatherAnnualIncome = false;
    showRTE = false;
}

class ColumnHandle {
    name: any;
    key: any;
    inputType: string;
    show: boolean;
		selectedList: any;

    constructor(name, key, inputType, show, selectedList) {
        this.name = name;
        this.key = key;
        this.inputType = inputType;
        this.show = show;
				this.selectedList = selectedList;
    }
}

const GENDER_LIST = [
 'Male',
 'Female',
 'Other',
];

const CATEGORY_LIST = [
 	'SC',
	'ST',
	'OBC',
	'Gen.',
];

const RTE_LIST = [
	'YES',
	'NO',
];

const BLOOD_GROUP_LIST = [
	'A -',
	'A +',
	'B -',
	'B +',
	'AB -',
	'AB +',
	'O -',
	'O +',
];

const RELIGION_LIST = [
	'Hinduism',
	'Islam',
	'Jainism',
	'Christianity',
];

@Component({
    selector: 'update-all',
    templateUrl: './update-all.component.html',
    styleUrls: ['./update-all.component.css'],
    providers: [StudentService, ClassService],
})

export class UpdateAllComponent implements OnInit {

    @Input() user;

    columnFilter: ColumnFilter;

    COLUMNHANDLES: ColumnHandle[] = [
        // value, key, inputType, show, selectedList
        new ColumnHandle('S No.', 'serialNumber', 'number', true, ''), // 0
        new ColumnHandle('Name', 'name', 'text', true, ''), // 1
        new ColumnHandle('Class Name', 'className', null, true, ''), // 2
        new ColumnHandle('Roll No.', 'rollNumber', 'number', false, ''), // 3
        new ColumnHandle('Father\'s Name', 'fathersName', 'text', true, ''), // 4
        new ColumnHandle('Mobile No.', 'mobileNumber', 'number', true, ''), // 5
        new ColumnHandle('Scholar No.', 'scholarNumber', 'number', false, ''), // 6
        new ColumnHandle('Date of Birth', 'dateOfBirth', 'date', false, ''), // 7
        new ColumnHandle('Mother\'s Name', 'motherName', 'text', false, ''), // 10
        new ColumnHandle('Gender', 'gender', 'list', false, GENDER_LIST), // 11
        new ColumnHandle('Caste', 'caste', 'text', false, ''), // 12
        new ColumnHandle('Category', 'category', 'list', false, CATEGORY_LIST), // 13
        new ColumnHandle('Religion', 'religion', 'list', false, RELIGION_LIST), // 14
        new ColumnHandle('Father\'s Occupation', 'fatherOccupation', 'text', false, ''), // 15
        new ColumnHandle('Address', 'address', 'text', true, ''), // 16
        new ColumnHandle('Child SSMID', 'childSSMID', 'number', false, ''), // 17
        new ColumnHandle('Family SSMID', 'familySSMID', 'number', false, ''), // 18
        new ColumnHandle('Bank Name', 'bankName', 'text', false, ''), // 19
        new ColumnHandle('Bank Acc. No.', 'bankAccounNum', 'text', false, ''), // 20
        new ColumnHandle('Aadhar No.', 'aadharNum', 'number', false, ''), // 21
        new ColumnHandle('Blood Group', 'bloodGroup', 'list', false, BLOOD_GROUP_LIST), // 22
        new ColumnHandle('Father\'s Annual Income', 'fatherAnnualIncome', 'text', false, ''), // 23
        new ColumnHandle('RTE', 'rte', 'list', false, RTE_LIST),
    ];

    /* Category Options */
    scSelected = false;
    stSelected = false;
    obcSelected = false;
    generalSelected = false;

    /* Gender Options */
    maleSelected = false;
    femaleSelected = false;
    otherGenderSelected = false;

    /* Admission Session Options */
    newAdmission = true;
    oldAdmission = true;

    /* RTE Options */
    yesRTE = true;
    noRTE = true;
    unknownRTE = true;

    displayStudentNumber = 0;

    // classSectionStudentList = [];

    classSectionList = [];
    classList = [];
    sectionList = [];

    studentFullProfileList = [];

    isLoading = false;

    constructor(private studentService: StudentService,
                private classService: ClassService) { }

    ngOnInit(): void {

        this.columnFilter = new ColumnFilter();

        const student_full_profile_request_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        const class_section_request_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        this.isLoading = true;
        Promise.all([
            this.classService.getClassSectionList(class_section_request_data, this.user.jwt),
            this.studentService.getStudentFullProfileList(student_full_profile_request_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.initializeClassSectionList(value[0]);
            this.initializeStudentFullProfileList(value[1]);
        }, error => {
            this.isLoading = false;
        });

    }

    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach(classs => {
            classs.sectionList.forEach(section => {
                section.selected = false;
                section.containsStudent = false;
            });
        });
    }

    /*initializeClassList(classList: any): void {
        this.classList = classList;
    }

    initializeSectionList(sectionList: any): void {
        this.sectionList = sectionList;
    }*/

    initializeStudentFullProfileList(studentFullProfileList: any): void {
        this.studentFullProfileList = studentFullProfileList.filter( student => {
            return student.parentTransferCertificate == null;
        });
        this.studentFullProfileList.forEach(studentFullProfile => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.classDbId, studentFullProfile.sectionDbId);
            studentFullProfile['show'] = false;
        });
        this.handleStudentDisplay();
    }

    getSectionObject(classDbId: any, sectionDbId: number): any {
        let sectionObject = null;
        this.classSectionList.every(classs => {
            classs.sectionList.every(section => {
                if (sectionDbId === section.dbId && classDbId === classs.dbId) {
                    sectionObject = section;
                    section.containsStudent = true;
                    return false;
                }
                return true;
            });
            if (sectionObject) {
                return false;
            }
            return true;
        });
        if (!sectionObject) {
            console.log('Error: should have section object');
        }
        return sectionObject;
    }

    unselectAllClasses(): void {
        this.classSectionList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = false;
                });
            }
        );
        this.handleStudentDisplay();
    };

    selectAllClasses(): void {
        this.classSectionList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = true;
                });
            }
        );
        this.handleStudentDisplay();
    };

    selectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = true;
        });
    };

    unSelectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = false;
        });
    };

    showSectionName(classs: any): boolean {
        let sectionLength = 0;
        classs.sectionList.every(section => {
            if (section.containsStudent) {
                ++sectionLength;
            }
            if (sectionLength > 1) {
                return false;
            } else {
                return true;
            }
        });
        return sectionLength > 1;
    }

    handleStudentDisplay(): void {
        let serialNumber = 0;
        this.displayStudentNumber = 0;

        this.studentFullProfileList.forEach(student => {

            /* Class Section Check */
            if (!student.sectionObject.selected) {
                student.show = false;
                return;
            }

            /* Category Check */
            if (!(this.scSelected && this.stSelected && this.obcSelected && this.generalSelected)
                && !(!this.scSelected && !this.stSelected && !this.obcSelected && !this.generalSelected)) {
                if (student.category === null || student.category === '') {
                    student.show = false;
                    return;
                }
                switch (student.category) {
                    case 'SC':
                        if (!this.scSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'ST':
                        if (!this.stSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'OBC':
                        if (!this.obcSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Gen.':
                        if (!this.generalSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Gender Check */
            if (!(this.maleSelected && this.femaleSelected && this.otherGenderSelected)
                && !(!this.maleSelected && !this.femaleSelected && !this.otherGenderSelected)) {
                if (student.gender === null || student.gender === '') {
                    student.show = false;
                    return;
                }
                switch (student.gender) {
                    case 'Male':
                        if (!this.maleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Female':
                        if (!this.femaleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Other':
                        if (!this.otherGenderSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Admission Filter Check */
            if (!this.newAdmission
                && student.admissionSessionDbId === this.user.activeSchool.currentSessionDbId) {
                student.show = false;
                return;
            } else if (!this.oldAdmission
                && student.admissionSessionDbId !== this.user.activeSchool.currentSessionDbId) {
                student.show = false;
                return;
            }

            /* RTE Filter Check */
            if (!this.yesRTE && student.rte === "YES") {
                student.show = false;
                return;
            } else if (!this.noRTE && student.rte === "NO") {
                student.show = false;
                return;
            } else if (!this.unknownRTE && (student.rte === null || student.rte === undefined)) {
                student.show = false;
                return;
            }

            ++this.displayStudentNumber;
            student.show = true;
            student.serialNumber = ++serialNumber;

        });

    };

    updateStudentField(): void {

    }

}
