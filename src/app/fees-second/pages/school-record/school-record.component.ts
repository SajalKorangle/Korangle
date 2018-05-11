import {Component, Input, OnInit} from '@angular/core';

import {FeeService} from '../../fee.service';
import {ClassService} from '../../../services/class.service';
import {StudentFeeProfile} from '../../classes/student-fee-profile';

class ColumnFilter {
  showSerialNumber = true;
  showName = true;
  showClassName = true;
  showFathersName = true;
  showMobileNumber = true;
  showScholarNumber = true;
  showTotalFees = true;
  showFeesDue = true;
  showRTE = true;
}

@Component({
  selector: 'app-school-fee-record',
  templateUrl: './school-record.component.html',
  styleUrls: ['./school-record.component.css'],
  providers: [ FeeService, ClassService ],
})

export class SchoolRecordComponent implements OnInit {

  @Input() user;

  columnFilter: ColumnFilter;

  displayStudentNumber = 0;
  totalStudents = 0;

  studentFeeProfileList = [];

  classSectionList = [];

  isLoading = false;

  constructor(private feeService: FeeService,
              private classService: ClassService) {}

  ngOnInit(): void {
    this.columnFilter = new ColumnFilter();
    const student_fee_profile_request_data = {
      schoolDbId: this.user.schoolDbId,
      sessionDbId: this.user.schoolCurrentSessionDbId,
    };
    const class_section_request_data = {
        sessionDbId: this.user.schoolCurrentSessionDbId,
    }
      this.isLoading = true;
      Promise.all([
          this.classService.getClassSectionList(class_section_request_data, this.user.jwt),
          this.feeService.getStudentFeeProfileList(student_fee_profile_request_data, this.user.jwt),
      ]).then(value => {
          this.isLoading = false;
          this.initializeClassSectionList(value[0]);
          this.initializeStudentFeeProfileList(value[1]);
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

  initializeStudentFeeProfileList(studentFeeProfileList: any): void {
      this.studentFeeProfileList = studentFeeProfileList;
      this.studentFeeProfileList.forEach(studentFeeProfile => {
          studentFeeProfile['sectionObject'] = this.getSectionObject(studentFeeProfile.sectionDbId);
          studentFeeProfile['totalFees'] = StudentFeeProfile.getStudentTotalFee(studentFeeProfile);
          studentFeeProfile['feesDue'] = StudentFeeProfile.getStudentFeesDue(studentFeeProfile);
      });
  }

  getSectionObject(sectionDbId: number): any {
      let sectionObject = null;
      this.classSectionList.every(classs => {
          classs.sectionList.every(section => {
              if (sectionDbId === section.dbId) {
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
      if (!sectionObject) { console.log('Error: should have section object'); }
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
  };

  selectAllClasses(): void {
    this.classSectionList.forEach(
      classs => {
        classs.sectionList.forEach(section => {
          section.selected = true;
        });
      }
    );
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

  showSectionName(classs: any): any {
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

  getStudentDisplayList(): any {
      return this.studentFeeProfileList.filter((studentFeeProfile) => {
          if (studentFeeProfile.sectionObject.selected === true) {
              return true;
          } else {
              return false;
          }
      });
  }

  /*handleStudentDisplay(): void {
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
  };*/

}
