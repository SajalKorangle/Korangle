import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../classes/student';
import { Classs } from '../../classes/classs';
import { StudentService } from '../../services/student.service';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.css'],
    providers: [ StudentService ],
})
export class StudentListComponent implements OnInit {

    @Input() user;

    showSerialNumber = true;
    showName = true;
    showClassName = true;
    showFathersName = true;
    showMobileNumber = true;
    showScholarNumber = false;
    showDateOfBirth = false;
    showTotalFees = true;
    showFeesDue = true;
    showMotherName = false;
    showGender = false;
    showCaste = false;
    showCategory = false;
    showReligion = false;
    showFatherOccupation = false;
    showAddress = false;
    showChildSSMID = false;
    showFamilySSMID = false;
    showBankName = false;
    showBankAccountNum = false;
    showAadharNum = false;
    showBloodGroup = false;
    showFatherAnnualIncome = false;

    /* Category Options */
    scSelected = true;
    stSelected = true;
    obcSelected = true;
    generalSelected = true;

    /* Gender Options */
    maleSelected = true;
    femaleSelected = true;
    otherGenderSelected = true;

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
        this.studentService.getStudentDataClassList().then(
            data => {
                this.isLoading = false;
                this.studentList = data['studentList'];
                this.classList = data['classList'];
                this.classList.forEach(
                    classs => {
                        classs.selected = true;
                    }
                );
                let serialNumber = 0;
                this.displayStudentNumber = 0;
                this.studentList.forEach(
                    student => {
                        student.show = true;
                        ++this.displayStudentNumber;
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
        this.showSerialNumber = true;
        this.showName = true;
        this.showClassName = true;
        this.showFathersName = true;
        this.showMobileNumber = true;
        this.showScholarNumber = true;
        this.showDateOfBirth = true;
        this.showTotalFees = true;
        this.showFeesDue = true;
        this.showMotherName = true;
        this.showGender = true;
        this.showCaste = true;
        this.showCategory = true;
        this.showReligion = true;
        this.showFatherOccupation = true;
        this.showAddress = true;
        this.showChildSSMID = true;
        this.showFamilySSMID = true;
        this.showBankName = true;
        this.showBankAccountNum = true;
        this.showAadharNum = true;
        this.showBloodGroup = true;
        this.showFatherAnnualIncome = true;
    }

    unselectAllColumns(): void {
        this.showSerialNumber = false;
        this.showName = false;
        this.showClassName = false;
        this.showFathersName = false;
        this.showMobileNumber = false;
        this.showScholarNumber = false;
        this.showDateOfBirth = false;
        this.showTotalFees = false;
        this.showFeesDue = false;
        this.showMotherName = false;
        this.showGender = false;
        this.showCaste = false;
        this.showCategory = false;
        this.showReligion = false;
        this.showFatherOccupation = false;
        this.showAddress = false;
        this.showChildSSMID = false;
        this.showFamilySSMID = false;
        this.showBankName = false;
        this.showBankAccountNum = false;
        this.showAadharNum = false;
        this.showBloodGroup = false;
        this.showFatherAnnualIncome = false;
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
                if (!(this.scSelected && this.stSelected && this.obcSelected && this.generalSelected)) {
                    if (student.category === null || student.category === '') {
                        student.show = false;
                        return;
                    }
                    switch (student.category) {
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
                    }
                }

                /* Gender Check */
                if (!(this.maleSelected && this.femaleSelected && this.otherGenderSelected)) {
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

}
