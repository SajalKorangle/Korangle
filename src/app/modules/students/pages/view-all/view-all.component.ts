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

@Component({
    selector: 'view-all',
    templateUrl: './view-all.component.html',
    styleUrls: ['./view-all.component.css'],
    providers: [StudentService, ClassService],
})

export class ViewAllComponent implements OnInit {

    @Input() user;

    columnFilter: ColumnFilter;

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

    printStudentList(): void {
        // alert('Functionality needs to be implemented once again');
        const value = {
            studentList: this.studentFullProfileList.filter(student => {
                return student.show
            }),
            columnFilter: this.columnFilter
        };
        EmitterService.get('print-student-list').emit(value);
    };

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

    downloadList(): void {

        let template: any;

        template = [

            this.getHeaderValues(),

        ];

        this.studentFullProfileList.forEach(student => {
            if (student.show) {
                template.push(this.getStudentDisplayInfo(student));
            }
        });

        console.log(template);

        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(template);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'korangle_students.csv');
    }

    getHeaderValues(): any {
        let headerValues = [];
        headerValues.push((this.columnFilter.showSerialNumber)? 'Serial No.': '');
        headerValues.push((this.columnFilter.showName)? 'Name': '');
        headerValues.push((this.columnFilter.showClassName)? 'Class Name': '');
        headerValues.push((this.columnFilter.showRollNumber)? 'Roll Number': '');
        headerValues.push((this.columnFilter.showFathersName)? 'Father\'s Name': '');
        headerValues.push((this.columnFilter.showMobileNumber)? 'Mobile No.': '');
        headerValues.push((this.columnFilter.showScholarNumber)? 'Scholar No.': '');
        headerValues.push((this.columnFilter.showDateOfBirth)? 'Date of Birth': '');
        headerValues.push((this.columnFilter.showMotherName)? 'Mother\'s Name': '');
        headerValues.push((this.columnFilter.showGender)? 'Gender': '');
        headerValues.push((this.columnFilter.showCaste)? 'Caste': '');
        headerValues.push((this.columnFilter.showCategory)? 'Category': '');
        headerValues.push((this.columnFilter.showReligion)? 'Religion': '');
        headerValues.push((this.columnFilter.showFatherOccupation)? 'Father\'s Occupation': '');
        headerValues.push((this.columnFilter.showAddress)? 'Address': '');
        headerValues.push((this.columnFilter.showChildSSMID)? 'Child SSMID': '');
        headerValues.push((this.columnFilter.showFamilySSMID)? 'Family SSMID': '');
        headerValues.push((this.columnFilter.showBankName)? 'Bank Name': '');
        headerValues.push((this.columnFilter.showBankAccountNum)? 'Bank Account No.': '');
        headerValues.push((this.columnFilter.showAadharNum)? 'Aadhar No.': '');
        headerValues.push((this.columnFilter.showBloodGroup)? 'Blood Group': '');
        headerValues.push((this.columnFilter.showFatherAnnualIncome)? 'Father\'s Annual Income': '');
        headerValues.push((this.columnFilter.showRTE)? 'RTE': '');

        return headerValues;
    }

    getStudentDisplayInfo(student: any): any {
        let studentDisplay = [];
        studentDisplay.push((this.columnFilter.showSerialNumber)? student.serialNumber: '');
        studentDisplay.push((this.columnFilter.showName)? student.name: '');
        studentDisplay.push((this.columnFilter.showClassName)? student.className: '');
        studentDisplay.push((this.columnFilter.showRollNumber)? student.rollNumber: '');
        studentDisplay.push((this.columnFilter.showFathersName)? student.fathersName: '');
        studentDisplay.push((this.columnFilter.showMobileNumber)? student.mobileNumber: '');
        studentDisplay.push((this.columnFilter.showScholarNumber)? student.scholarNumber: '');
        studentDisplay.push((this.columnFilter.showDateOfBirth)? student.dateOfBirth: '');
        studentDisplay.push((this.columnFilter.showMotherName)? student.motherName: '');
        studentDisplay.push((this.columnFilter.showGender)? student.gender: '');
        studentDisplay.push((this.columnFilter.showCaste)? student.caste: '');
        studentDisplay.push((this.columnFilter.showCategory)? student.category: '');
        studentDisplay.push((this.columnFilter.showReligion)? student.religion: '');
        studentDisplay.push((this.columnFilter.showFatherOccupation)? student.fatherOccupation: '');
        studentDisplay.push((this.columnFilter.showAddress)? student.address: '');
        studentDisplay.push((this.columnFilter.showChildSSMID)? student.childSSMID: '');
        studentDisplay.push((this.columnFilter.showFamilySSMID)? student.familySSMID: '');
        studentDisplay.push((this.columnFilter.showBankName)? student.bankName: '');
        studentDisplay.push((this.columnFilter.showBankAccountNum)? student.bankAccountNum: '');
        studentDisplay.push((this.columnFilter.showAadharNum && student.aadharNum)?student.aadharNum.toString(): '');
        studentDisplay.push((this.columnFilter.showBloodGroup)? student.bloodGroup: '');
        studentDisplay.push((this.columnFilter.showFatherAnnualIncome)? student.fatherAnnualIncome: '');
        studentDisplay.push((this.columnFilter.showRTE)? student.rte: '');

        return studentDisplay;
    }

    addToArray(trueOrFalse: boolean, array: any, trueValue: any, falseValue: any): void {

    }

}
