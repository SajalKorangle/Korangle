import {Component, Input, OnInit} from '@angular/core';

import {EmitterService} from '../../../services/emitter.service';
import {StudentService} from '../../student.service';

class ColumnFilter {
  showSerialNumber = true;
  showName = true;
  showClassName = false;
  showRollNumber = false;
  showFathersName = true;
  showMobileNumber = true;
  showScholarNumber = false;
  showDateOfBirth = false;
  // showTotalFees = false;
  // showFeesDue = false;
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
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
  providers: [StudentService],
})

export class StudentListComponent implements OnInit {

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

  displayStudentNumber = 0;
  totalStudents = 0;

  classSectionStudentList = [];

  isLoading = false;

  constructor(private studentService: StudentService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.columnFilter = new ColumnFilter();
    const data = {
      sessionDbId: this.user.schoolCurrentSessionDbId,
    };
    this.studentService.getStudentProfileListAndClassSectionList(data, this.user.jwt).then(
      data => {

        console.log(data);

        this.isLoading = false;
        this.classSectionStudentList = data;
        this.classSectionStudentList.forEach(classs => {
          classs.sectionList.forEach(section => {
            section.selected = false;
            section.studentList.forEach(student => {
              student.show = false;
              ++this.totalStudents;
            });
          });
        });

        if (this.classSectionStudentList.length === 0) {
          alert('0 students present. You can add students from \'New Students\' section');
        }

        console.log('okay');

      }
    );
  }

  printStudentList(): void {
    const value = {
      classSectionStudentList: this.classSectionStudentList,
      columnFilter: this.columnFilter
    };
    EmitterService.get('print-student-list').emit(value);
  };

  unselectAllClasses(): void {
    this.classSectionStudentList.forEach(
      classs => {
        classs.sectionList.forEach(section => {
          section.selected = false;
        });
      }
    );
    this.handleStudentDisplay();
  };

  selectAllClasses(): void {
    this.classSectionStudentList.forEach(
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

  handleStudentDisplay(): void {
    let serialNumber = 0;
    this.displayStudentNumber = 0;
    this.classSectionStudentList.forEach(classs => {
      classs.sectionList.forEach(section => {
        if (section.selected === false) {
          section.studentList.forEach(student => {
            student.show = false;
          });
        } else {
          section.studentList.forEach(student => {

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

            ++this.displayStudentNumber;
            student.show = true;
            student.serialNumber = ++serialNumber;
          });
        }
      });
    });
  };

}
