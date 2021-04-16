import {Component, Input, OnInit} from '@angular/core';

import {ClassService} from '../../../../services/modules/class/class.service';
import {StudentOldService} from '../../../../services/modules/student/student-old.service';
import {StudentService} from '../../../../services/modules/student/student.service';
import { ChangeDetectorRef } from '@angular/core';
import {DataStorage} from '../../../../classes/data-storage';
import { UpdateAllServiceAdapter } from './update-all.service.adapter';
import { PARAMETER_TYPE_LIST } from '../../classes/parameter';

class ColumnHandle {
    name: any;
    key: any;
    inputType: string;
    show: boolean;
    list: any;

    constructor(name, key, inputType, show, list) {
        this.name = name;
        this.key = key;
        this.inputType = inputType;
        this.show = show;
        this.list = list;
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
    providers: [StudentOldService, ClassService, StudentService],
})

export class UpdateAllComponent implements OnInit {

    user:any ;

    COLUMNHANDLES: ColumnHandle[] = [
        // value, key, inputType, show, selectedList
        new ColumnHandle('S No.', 'serialNumber', null, true, ''), // 0
        new ColumnHandle('Name', 'name', 'text', true, ''), // 1
        new ColumnHandle('Class Name', 'className', null, true, ''), // 2
        new ColumnHandle('Roll No.', 'rollNumber', null, false, ''), // 3
        new ColumnHandle('Father\'s Name', 'fathersName', 'text', true, ''), // 4
        new ColumnHandle('Mobile No.', 'mobileNumber', 'number', true, ''), // 5
        new ColumnHandle('Alternate Mobile No.', 'secondMobileNumber', 'number', true, ''), // 5
        new ColumnHandle('Scholar No.', 'scholarNumber', 'text', false, ''), // 6
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
        new ColumnHandle('Bank Ifsc Code', 'bankIfscCode', 'text', false, ''), // 20
        new ColumnHandle('Bank Acc. No.', 'bankAccountNum', 'text', false, ''), // 21
        new ColumnHandle('Aadhar No.', 'aadharNum', 'number', false, ''), // 22
        new ColumnHandle('Blood Group', 'bloodGroup', 'list', false, BLOOD_GROUP_LIST), // 23
        new ColumnHandle('Father\'s Annual Income', 'fatherAnnualIncome', 'text', false, ''), // 24
        new ColumnHandle('RTE', 'rte', 'list', false, RTE_LIST), // 25
        new ColumnHandle('Date Of Admission', 'dateOfAdmission', 'date', false, ''), // 26
        new ColumnHandle('Admission Class', 'parentAdmissionClass', 'classList', false, ''), // 27
    ];

    NULL_CONSTANT = null;

    parameter_type_list = PARAMETER_TYPE_LIST;

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

    displayStudentNumber = 0;

    // classSectionStudentList = [];

    classSectionList = [];
    classList = [];
    sectionList = [];

    studentFullProfileList = [];
    
    noFileIcon ="/assets/img/noFileIcon.png";
    pdfIcon ="/assets/img/pdfIcon.png";
    imageIcon ="/assets/img/imageIcon.png";

    isLoading = false;

    studentParameterList: any[] = [];
    studentParameterValueList: any[] = [];
    serviceAdapter: UpdateAllServiceAdapter;

    constructor(public studentOldService: StudentOldService,
            public studentService: StudentService,
            public classService: ClassService,
            public cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new UpdateAllServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        console.log('this: ', this);
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
                if (sectionDbId === section.id && classDbId === classs.id) {
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

    showAllColumns(): void {
        this.COLUMNHANDLES.forEach(item => {
            item.show = true;
        });
    }

    hideAllColumns(): void {
        this.COLUMNHANDLES.forEach(item => {
            item.show = false;
        });
        this.studentParameterList.forEach(item=>{
            item.show = false;
        })
    }

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
            }

            ++this.displayStudentNumber;
            student.show = true;
            student.serialNumber = ++serialNumber;

        });

        this.cdRef.detectChanges();
    };

    getStudentFullProfileList(): any {
        return this.studentFullProfileList.filter(item => {
            return item.show;
        });
    }
    
    getParameterValue = (student, parameter) => {
        try {
            return this.studentParameterValueList.find(x => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id).value;
        } catch {
            return this.NULL_CONSTANT;
        }
    }
    
    getDocumentName(student, parameter){
        let item =  this.studentParameterValueList.find(x =>x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id);
        if (item) {
            if (item.document_name){
                return item.document_name;
            }else{
                 let document_name = item.document_value.split("/")
                 document_name = document_name[document_name.length-1];
                 return document_name.substring(document_name.indexOf("_")+1,document_name.length);
            }
        }
        return "No File Chosen";
    }
    
	getDocumentIcon(student,parameter){
    	try {
            let value =  this.studentParameterValueList.find(x =>x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id).document_value;
            if (value){
                if (value ==="" || value===undefined){
                    return this.NULL_CONSTANT;
                }
                else{
                    let type = value.split(".")
                    type = type[type.length-1]
                    if (type=="pdf"){
                        return this.pdfIcon;
                    }
                    else if (type=="jpg"|| type=="jpeg" || type=="png"){
                        return this.imageIcon;
                    }
                }
            } else{
                return this.noFileIcon;
            }
        }
        catch{
            return this.noFileIcon;
        }
    }
}
