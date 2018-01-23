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

    classList: Classs[] = [];
    selectedClass: Classs;

    studentList: Student[] = [];

    isLoading = false;

    constructor (private studentService: StudentService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.studentService.getStudentDataClassList().then(
            data => {
                this.isLoading = false;
                this.studentList = data['studentList'];
                this.classList = data['classList'];
                this.selectedClass = this.classList[0];
            }, error => {
                this.isLoading = false;
                alert('Server Error: Contact Admin');
            }
        );
    }

    showStudent(student): boolean {
        if (this.selectedClass.dbId !== 0) {
            if (this.selectedClass.dbId !== student.classDbId) {
                return true;
            }
        }
        return false;
    }

}
