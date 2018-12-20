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
        (this.columnFilter.showSerialNumber)? headerValues.push('Serial No.'): '';
        (this.columnFilter.showName)? headerValues.push('Name'): '';
        (this.columnFilter.showClassName)? headerValues.push('Class Name'): '';
        (this.columnFilter.showRollNumber)? headerValues.push('Roll Number'): '';
        (this.columnFilter.showFathersName)? headerValues.push('Father\'s Name'): '';
        (this.columnFilter.showMobileNumber)? headerValues.push('Mobile No.'): '';
        (this.columnFilter.showScholarNumber)? headerValues.push('Scholar No.'): '';
        (this.columnFilter.showDateOfBirth)? headerValues.push('Date of Birth'): '';
        (this.columnFilter.showMotherName)? headerValues.push('Mother\'s Name'): '';
        (this.columnFilter.showGender)? headerValues.push('Gender'): '';
        (this.columnFilter.showCaste)? headerValues.push('Caste'): '';
        (this.columnFilter.showCategory)? headerValues.push('Category'): '';
        (this.columnFilter.showReligion)? headerValues.push('Religion'): '';
        (this.columnFilter.showFatherOccupation)? headerValues.push('Father\'s Occupation'): '';
        (this.columnFilter.showAddress)? headerValues.push('Address'): '';
        (this.columnFilter.showChildSSMID)? headerValues.push('Child SSMID'): '';
        (this.columnFilter.showFamilySSMID)? headerValues.push('Family SSMID'): '';
        (this.columnFilter.showBankName)? headerValues.push('Bank Name'): '';
        (this.columnFilter.showBankAccountNum)? headerValues.push('Bank Account No.'): '';
        (this.columnFilter.showAadharNum)? headerValues.push('Aadhar No.'): '';
        (this.columnFilter.showBloodGroup)? headerValues.push('Blood Group'): '';
        (this.columnFilter.showFatherAnnualIncome)? headerValues.push('Father\'s Annual Income'): '';
        (this.columnFilter.showRTE)? headerValues.push('RTE'): '';

        return headerValues;
    }

    getStudentDisplayInfo(student: any): any {
        let studentDisplay = [];
        (this.columnFilter.showSerialNumber)? studentDisplay.push(student.serialNumber): '';
        (this.columnFilter.showName)? studentDisplay.push(student.name): '';
        (this.columnFilter.showClassName)? studentDisplay.push(student.className): '';
        (this.columnFilter.showRollNumber)? studentDisplay.push(student.rollNumber): '';
        (this.columnFilter.showFathersName)? studentDisplay.push(student.fathersName): '';
        (this.columnFilter.showMobileNumber)? studentDisplay.push(student.mobileNumber): '';
        (this.columnFilter.showScholarNumber)? studentDisplay.push(student.scholarNumber): '';
        (this.columnFilter.showDateOfBirth)? studentDisplay.push(student.dateOfBirth): '';
        (this.columnFilter.showMotherName)? studentDisplay.push(student.motherName): '';
        (this.columnFilter.showGender)? studentDisplay.push(student.gender): '';
        (this.columnFilter.showCaste)? studentDisplay.push(student.caste): '';
        (this.columnFilter.showCategory)? studentDisplay.push(student.category): '';
        (this.columnFilter.showReligion)? studentDisplay.push(student.religion): '';
        (this.columnFilter.showFatherOccupation)? studentDisplay.push(student.fatherOccupation): '';
        (this.columnFilter.showAddress)? studentDisplay.push(student.address): '';
        (this.columnFilter.showChildSSMID)? studentDisplay.push(student.childSSMID): '';
        (this.columnFilter.showFamilySSMID)? studentDisplay.push(student.familySSMID): '';
        (this.columnFilter.showBankName)? studentDisplay.push(student.bankName): '';
        (this.columnFilter.showBankAccountNum)? studentDisplay.push(student.bankAccountNum): '';
        (this.columnFilter.showAadharNum)? studentDisplay.push(student.aadharNum.toString()): '';
        (this.columnFilter.showBloodGroup)? studentDisplay.push(student.bloodGroup): '';
        (this.columnFilter.showFatherAnnualIncome)? studentDisplay.push(student.fatherAnnualIncome): '';
        (this.columnFilter.showRTE)? studentDisplay.push(student.rte): '';

        return studentDisplay;
    }

}
