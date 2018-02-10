import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../classes/student';
import { Classs } from '../../classes/classs';
import { EmitterService } from "../../services/emitter.service";
import { StudentService } from '../../services/student.service';

class ColumnFilter {
    showSerialNumber = true;
    showName = true;
    showClassName = false;
    showRollNumber = false;
    showFathersName = true;
    showMobileNumber = true;
    showScholarNumber = false;
    showDateOfBirth = false;
    showTotalFees = false;
    showFeesDue = false;
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
}

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.css'],
    providers: [ StudentService ],
})

export class StudentListComponent implements OnInit {

    @Input() user;

    columnFilter: ColumnFilter;

    /* Column Locks */
    lockName = true;

    /* Category Options */
    scSelected = false;
    stSelected = false;
    obcSelected = false;
    generalSelected = false;

    /* Gender Options */
    maleSelected = false;
    femaleSelected = false;
    otherGenderSelected = false;

    displayStudentNumber = 0;

    // classList: Classs[] = [];
    // selectedClass: Classs;

    // studentList: Student[] = [];

    classList = [];
    studentList = [];

    isLoading = false;

    constructor (private studentService: StudentService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.columnFilter = new ColumnFilter();
        this.studentService.getStudentDataClassList().then(
            data => {
                this.isLoading = false;
                this.studentList = data['studentList'];
                this.classList = data['classList'];
                this.classList.forEach(
                    classs => {
                        classs.selected = false;
                    }
                );
                let serialNumber = 0;
                this.displayStudentNumber = 0;
                this.studentList.forEach(
                    student => {
                        student.show = false;
                        student.serialNumber = ++serialNumber;
                        this.classList.forEach(
                            classs => {
                                if (student.classDbId === classs.dbId) {
                                    student.classs = classs;
                                }
                            }
                        );
                    }
                );
                // this.selectedClass = this.classList[0];
            }, error => {
                this.isLoading = false;
                alert('Server Error: Contact Admin');
            }
        );
    }

    printStudentList(): void {
        const value = {
            studentList: this.studentList,
            columnFilter: this.columnFilter
        };
        value.studentList = this.studentList;
        value.columnFilter = this.columnFilter;
        EmitterService.get('print-student-list').emit(value);
    }

    unselectAllClasses(): void {
        this.classList.forEach(
            classs => {
                classs.selected = false;
            }
        );
        this.handleStudentDisplay();
    }

    selectAllClasses(): void {
        this.classList.forEach(
            classs => {
                classs.selected = true;
            }
        );
        this.handleStudentDisplay();
    }

    selectAllColumns(): void {
        this.columnFilter.showSerialNumber = true;
        this.columnFilter.showName = true;
        this.columnFilter.showClassName = true;
        this.columnFilter.showFathersName = true;
        this.columnFilter.showMobileNumber = true;
        this.columnFilter.showScholarNumber = true;
        this.columnFilter.showDateOfBirth = true;
        this.columnFilter.showTotalFees = true;
        this.columnFilter.showFeesDue = true;
        this.columnFilter.showMotherName = true;
        this.columnFilter.showGender = true;
        this.columnFilter.showCaste = true;
        this.columnFilter.showCategory = true;
        this.columnFilter.showReligion = true;
        this.columnFilter.showFatherOccupation = true;
        this.columnFilter.showAddress = true;
        this.columnFilter.showChildSSMID = true;
        this.columnFilter.showFamilySSMID = true;
        this.columnFilter.showBankName = true;
        this.columnFilter.showBankAccountNum = true;
        this.columnFilter.showAadharNum = true;
        this.columnFilter.showBloodGroup = true;
        this.columnFilter.showFatherAnnualIncome = true;
        this.columnFilter.showRollNumber = true;
    }

    unselectAllColumns(): void {
        this.columnFilter.showSerialNumber = false;
        this.columnFilter.showName = false;
        this.columnFilter.showClassName = false;
        this.columnFilter.showFathersName = false;
        this.columnFilter.showMobileNumber = false;
        this.columnFilter.showScholarNumber = false;
        this.columnFilter.showDateOfBirth = false;
        this.columnFilter.showTotalFees = false;
        this.columnFilter.showFeesDue = false;
        this.columnFilter.showMotherName = false;
        this.columnFilter.showGender = false;
        this.columnFilter.showCaste = false;
        this.columnFilter.showCategory = false;
        this.columnFilter.showReligion = false;
        this.columnFilter.showFatherOccupation = false;
        this.columnFilter.showAddress = false;
        this.columnFilter.showChildSSMID = false;
        this.columnFilter.showFamilySSMID = false;
        this.columnFilter.showBankName = false;
        this.columnFilter.showBankAccountNum = false;
        this.columnFilter.showAadharNum = false;
        this.columnFilter.showBloodGroup = false;
        this.columnFilter.showFatherAnnualIncome = false;
        this.columnFilter.showRollNumber = false;
    }

    handleStudentDisplay(): void {
        let serialNumber = 0;
        this.displayStudentNumber = 0;
        this.studentList.forEach(
            student => {

                /* Class Check */
                if (student.classs.selected === false) {
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
                    /*switch (student.category) {
                        case 'Scheduled Caste':
                            if (!this.scSelected) {
                                student.show = false;
                                return;
                            }
                            break;
                        case 'Scheduled Tribe':
                            if (!this.stSelected) {
                                student.show = false;
                                return;
                            }
                            break;
                        case 'Other Backward Classes':
                            if (!this.obcSelected) {
                                student.show = false;
                                return;
                            }
                            break;
                        case 'General':
                            if (!this.generalSelected) {
                                student.show = false;
                                return;
                            }
                            break;
                    }*/
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

                ++this.displayStudentNumber;
                student.show = true;
                student.serialNumber = ++serialNumber;
            }
        );
    }

    /*toggleLock(): void {
        if (this.lockName === 'lock') {
            this.lockName = 'lock open';
        } else {
            this.lockName = 'lock';
        }
    }*/
}
